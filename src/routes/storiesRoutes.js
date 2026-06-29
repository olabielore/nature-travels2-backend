import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllStories,
  getStoryById,
  createStory,
  deleteStory,
  updateStory,
  getPopularStories,
  getRecommendedStories,
  getMyStories,
  getSavedStories,
  toggleSaveStory,
} from '../controllers/storyController.js';
import {
  createStorySchema,
  storyIdSchema,
  updateStorySchema,
  getAllStoriesSchema,
  getMyStoriesSchema,
  recommendedStoriesSchema,
  savedStoriesSchema,
  toggleSaveStorySchema,
} from '../validations/storiesValidation.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/stories', celebrate(getAllStoriesSchema), getAllStories);
router.get('/stories/popular', getPopularStories);
router.get(
  '/stories/recommended',
  celebrate(recommendedStoriesSchema),
  getRecommendedStories,
);
router.get(
  '/stories/my',
  authenticate,
  celebrate(getMyStoriesSchema),
  getMyStories,
);
router.get(
  '/stories/saved',
  authenticate,
  celebrate(savedStoriesSchema),
  getSavedStories,
);
router.get('/stories/:storyId', celebrate(storyIdSchema), getStoryById);

router.post(
  '/stories',
  authenticate,
  celebrate(createStorySchema),
  createStory,
);
router.patch(
  '/stories/:storyId/save',
  authenticate,
  celebrate(toggleSaveStorySchema),
  toggleSaveStory,
);
router.patch(
  '/stories/:storyId',
  authenticate,
  celebrate(updateStorySchema),
  updateStory,
);
router.delete(
  '/stories/:storyId',
  authenticate,
  celebrate(storyIdSchema),
  deleteStory,
);

export default router;
