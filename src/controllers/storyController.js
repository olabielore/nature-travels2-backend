import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { Category } from '../models/category.js';
import { User } from '../models/user.js';

export const getAllStories = async (req, res) => {
  const { page = 1, perPage = 10, category, rate, search } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);
  const skip = (pageNumber - 1) * perPageNumber;

  const storiesQuery = Story.find();

  if (category) {
    storiesQuery.where({ category });
  }

  if (rate) {
    storiesQuery.where({ rate });
  }

  if (search) {
    storiesQuery.where({ $text: { $search: search } });
  }

  storiesQuery.populate('category').populate('ownerId', 'name avatarUrl');
  storiesQuery.sort({ createdAt: -1 });

  const [totalItems, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery.skip(skip).limit(perPageNumber),
  ]);

  const totalPages = Math.ceil(totalItems / perPageNumber);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages,
    stories,
  });
};

export const getMyStories = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);
  const skip = (pageNumber - 1) * perPageNumber;

  const filter = { ownerId: req.user._id };

  const storiesQuery = Story.find(filter);

  const [totalItems, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(filter),
    storiesQuery.populate('category').skip(skip).limit(perPageNumber),
  ]);

  const totalPages = Math.ceil(totalItems / perPageNumber);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages,
    stories,
  });
};

export const getStoryById = async (req, res) => {
  const { storyId } = req.params;
  const story = await Story.findById(storyId)
    .populate('category')
    .populate('ownerId', 'name avatarUrl');

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json(story);
};

export const getSavedStories = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);

  const user = await User.findById(req.user._id);

  const [totalItems, stories] = await Promise.all([
    Story.countDocuments({ _id: { $in: user.savedStories } }),
    Story.find({ _id: { $in: user.savedStories } })
      .populate('category')
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber),
  ]);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    stories,
  });
};

export const getRecommendedStories = async (req, res) => {
  const { category, storyId } = req.query;
  if (!category) throw createHttpError(400, 'Category is required');

  const stories = await Story.find({
    category,
    _id: { $ne: storyId },
  })
    .populate('category')
    .sort({ savedCount: -1 })
    .limit(3);

  res.status(200).json({ stories });
};

export const createStory = async (req, res) => {
  const { category } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) throw createHttpError(400, 'Category not found');

  const story = await Story.create({ ...req.body, ownerId: req.user._id });

  res.status(201).json(story);
};

export const deleteStory = async (req, res) => {
  const { storyId } = req.params;
  const story = await Story.findOneAndDelete({
    _id: storyId,
    ownerId: req.user._id,
  });

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json(story);
};

export const updateStory = async (req, res) => {
  const { storyId } = req.params;

  const story = await Story.findOneAndUpdate(
    { _id: storyId, ownerId: req.user._id },
    req.body,
    {
      new: true,
    },
  );

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json(story);
};

export const toggleSaveStory = async (req, res) => {
  const { storyId } = req.params;

  const user = await User.findById(req.user._id);
  const isSaved = user.savedStories.includes(storyId);

  if (isSaved) {
    await Promise.all([
      User.findByIdAndUpdate(req.user._id, {
        $pull: { savedStories: storyId },
      }),
      Story.findByIdAndUpdate(storyId, { $inc: { savedCount: -1 } }),
    ]);
    return res
      .status(200)
      .json({ status: 200, message: 'Story unsaved', data: { saved: false } });
  }

  await Promise.all([
    User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedStories: storyId },
    }),
    Story.findByIdAndUpdate(storyId, { $inc: { savedCount: 1 } }),
  ]);

  res
    .status(200)
    .json({ status: 200, message: 'Story saved', data: { saved: true } });
};
