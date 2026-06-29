import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import {
  getCurrentUser,
  updateUser,
  updateUserAvatar,
  getAllUsers,
  getUserById,
  saveStory,
  deleteStory,
  verifyUser,
} from '../controllers/userController.js';
import {
  updateUserSchema,
  getAllUsersSchema,
  getUserByIdSchema,
  saveStorySchema,
  deleteStorySchema,
  verifyUserSchema,
} from '../validations/userValidation.js';

const router = Router();

router.get('/users/me', celebrate(), getCurrentUser);
router.get('/users', celebrate(getAllUsersSchema), getAllUsers);
router.get('/users/:userId', celebrate(getUserByIdSchema), getUserById);
router.get('/users / verify /:token', celebrate(verifyUserSchema), verifyUser);

router.patch(
  '/users/me',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

router.patch(
  '/users/me/saved/:storyId',
  authenticate,
  celebrate(saveStorySchema),
  saveStory,
);
router.delete(
  '/users/me/saved/:storyId',
  authenticate,
  celebrate(deleteStorySchema),
  deleteStory,
);

export default router;
