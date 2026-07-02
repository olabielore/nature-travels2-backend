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
  verifyUser,
} from '../controllers/userController.js';
import {
  updateUserSchema,
  getAllUsersSchema,
  getUserByIdSchema,
  saveStorySchema,
  verifyUserSchema,
} from '../validations/userValidation.js';

import { toggleSaveStory } from '../controllers/storyController.js';

const router = Router();

router.get('/users/me', authenticate, getCurrentUser);
router.get('/users/verify/:token', celebrate(verifyUserSchema), verifyUser);
router.get('/users', celebrate(getAllUsersSchema), getAllUsers);
router.get('/users/:userId', celebrate(getUserByIdSchema), getUserById);

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
  toggleSaveStory,
);

export default router;
