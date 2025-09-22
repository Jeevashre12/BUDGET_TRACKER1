import express from 'express';
import {
  getAllRecipes,
  createRecipe,
  getRecipe,
  getUserRecipes,
  toggleLike,
  addReview
} from '../controllers/recipeController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/multer.js';

const recipeRouter = express.Router();

// Public routes
recipeRouter.get('/list', getAllRecipes);
recipeRouter.get('/:id', getRecipe);

// Protected routes
recipeRouter.post('/create', userAuth, upload.array('images', 5), createRecipe);
recipeRouter.get('/user/my-recipes', userAuth, getUserRecipes);
recipeRouter.post('/:id/like', userAuth, toggleLike);
recipeRouter.post('/:id/review', userAuth, addReview);

export default recipeRouter;