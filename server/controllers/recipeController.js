import recipeModel from '../models/recipeModel.js';
import userModel from '../models/userModel.js';
import cloudinary, { cloudinaryConfigured } from '../config/cloudinary.js';

// Get all recipes with filters and pagination
export const getAllRecipes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      cuisine,
      difficulty,
      dietary,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isPublished: true };

    // Apply filters
    if (category) query.category = category;
    if (cuisine) query.cuisine = cuisine;
    if (difficulty) query.difficulty = difficulty;
    if (dietary) query.dietaryTags = { $in: [dietary] };
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await recipeModel
      .find(query)
      .populate('author', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await recipeModel.countDocuments(query);

    res.json({
      success: true,
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new recipe
export const createRecipe = async (req, res) => {
  try {
    const {
      title, description, ingredients, instructions,
      cookingTime, prepTime, servings, difficulty,
      category, cuisine, dietaryTags, videoUrl
    } = req.body;

    let imageUrls = [];

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (cloudinaryConfigured) {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            folder: 'recipes'
          });
          imageUrls.push(result.secure_url);
        } else {
          // Fallback to local file URL
          const localUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
          imageUrls.push(localUrl);
        }
      }
    }

    // Fetch author name for denormalization
    const author = await userModel.findById(req.userId).select('name').lean();

    const recipe = new recipeModel({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
      images: imageUrls,
      videoUrl: videoUrl || '',
      cookingTime: Number(cookingTime),
      prepTime: Number(prepTime),
      servings: Number(servings),
      difficulty,
      category,
      cuisine,
      dietaryTags: dietaryTags ? JSON.parse(dietaryTags) : [],
      author: req.userId,
      authorName: author?.name || ''
    });

    await recipe.save();

    const populatedRecipe = await recipeModel
      .findById(recipe._id)
      .populate('author', 'name');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe: populatedRecipe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single recipe with views increment
export const getRecipe = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      )
      .populate('author', 'name')
      .populate('reviews.user', 'name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's recipes
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find({ author: req.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like/Unlike recipe
export const toggleLike = async (req, res) => {
  try {
    const recipe = await recipeModel.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const isLiked = recipe.likes.some(id => id.toString() === String(req.userId));

    // Allow only one like per user (no unlike)
    if (!isLiked) {
      recipe.likes.push(req.userId);
    }

    await recipe.save();

    res.json({
      success: true,
      message: isLiked ? 'Already liked' : 'Recipe liked',
      likesCount: recipe.likes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await recipeModel.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user already reviewed
    const existingReview = recipe.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      recipe.reviews.push({
        user: req.userId,
        rating,
        comment
      });
    }

    // Recalculate average rating
    const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
    recipe.avgRating = totalRating / recipe.reviews.length;
    recipe.totalReviews = recipe.reviews.length;

    await recipe.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      avgRating: recipe.avgRating,
      totalReviews: recipe.totalReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};