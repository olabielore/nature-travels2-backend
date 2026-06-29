import { Category } from '../models/category';

export const getCategories = async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
};

// export const getAllCategories = async (req, res) => {
//   const { page = 1, perPage = 10, category, search } = req.query;

//   const pageNumber = Number(page);
//   const perPageNumber = Number(perPage);

//   const skip = (pageNumber - 1) * perPageNumber;

//   const categoriesQuery = CATEGORIES.find({ userId: req.user._id });

//   if (category) {
//     categoriesQuery.where({ category });
//   }

//   if (search) {
//     categoriesQuery.where({ $text: { $search: search } });
//   }

//   const [totalCategories, categories] = await Promise.all([
//     categoriesQuery.clone().countDocuments(),
//     categoriesQuery.skip(skip).limit(perPageNumber),
//   ]);

//   const totalPages = Math.ceil(totalCategories / perPageNumber);

//   res.status(200).json({
//     page: pageNumber,
//     perPage: perPageNumber,
//     totalCategories,
//     totalPages,
//     categories,
//   });
// };
