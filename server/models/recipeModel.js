import mongoose from 'mongoose';
import { getRecipesConnection } from '../config/mongodbRecipes.js';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    }
  }],
  images: [{
    type: String // Cloudinary URLs
  }],
  videoUrl: {
    type: String // YouTube/Vimeo link or uploaded video URL
  },
  cookingTime: {
    type: Number,
    required: true // in minutes
  },
  prepTime: {
    type: Number,
    required: true // in minutes
  },
  servings: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'],
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  dietaryTags: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb']
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Match your user model name
    required: true
  },
  authorName: {
    type: String,
    required: false,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  avgRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text search index
recipeSchema.index({
  title: 'text',
  description: 'text',
  cuisine: 'text'
});

// Bind Recipe model to the recipes DB connection if available
let RecipeModel
try {
  const conn = getRecipesConnection()
  RecipeModel = conn.model('Recipe', recipeSchema)
} catch (_) {
  // Fallback to default connection if recipes DB is not initialized
  RecipeModel = mongoose.model('Recipe', recipeSchema)
}

export default RecipeModel;