import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Story } from '../models/story';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { EmailVerification } from '../models/emailVerification.js';
import { ONE_DAY } from '../constants/time';
import { sendMail } from '../utils/sendMail.js';
import { nanoid } from 'nanoid';

export const getAllUsers = async (req, res) => {
  const { page = 1, perPage = 10, search } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);

  const skip = (pageNumber - 1) * perPageNumber;

  const usersQuery = User.find({ userId: req.user._id });

  if (search) {
    usersQuery.where({ $text: { $search: search } });
  }

  const [totalUsers, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    usersQuery.skip(skip).limit(perPageNumber),
  ]);

  const totalPages = Math.ceil(totalUsers / perPageNumber);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalUsers,
    totalPages,
    users,
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user);
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw createHttpError(404, 'User not found');
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw createHttpError(404, 'User not found');

  if (name) user.name = name;

  if (email && email !== user.email) {
    const userExists = await User.findOne({ email });
    if (userExists) throw createHttpError(409, 'Email already in use');

    await EmailVerification.deleteOne({ userId: user._id });

    const token = nanoid();
    await EmailVerification.create({
      userId: user._id,
      newEmail: email,
      token,
      expiresAt: new Date(Date.now() + ONE_DAY),
    });

    await user.save();

    const verifyLink = `${process.env.FRONTEND_DOMAIN}/verify?token=${token}`;

    await sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<a href="${verifyLink}">Confirm email</a>`,
    });

    return res.json({ message: 'Verification email sent' });
  }

  await user.save();

  res.status(200).json({ message: 'User updated successfully', data: user });
};

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );

  res.status(200).json({ url: updatedUser.avatar });
};

export const saveStory = async (req, res) => {
  const { storyId } = req.params;

  const story = await Story.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { savedStories: storyId } },
    { new: true },
  );

  res.status(200).json(user);
};

export const deleteStory = async (req, res) => {
  const { storyId } = req.params;

  const user = await Story.findOneAndDelete(
    { _id: req.user._id },
    { $pull: { savedStories: storyId } },
    { new: true },
  );

  res.status(200).json(user);
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  const verification = await EmailVerification.findOne({
    token,
    expiresAt: new Date(Date.now() + ONE_DAY),
  });

  if (!verification) throw createHttpError(404, 'Invalid or expired token');

  await User.findByIdAndUpdate(verification.userId, {
    email: verification.newEmail,
    emailVerified: true,
  });

  await verification.deleteOne();

  res.status(200).json({ message: 'Email verified successfully' });
};
