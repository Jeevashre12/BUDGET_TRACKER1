import mongoose from "mongoose"

let recipesConnection = null

export const connectRecipesDB = async () => {
  try {
    if (!process.env.MONGODB_URI_RECIPES) {
      throw new Error("MONGODB_URI_RECIPES environment variable is not defined")
    }

    // Use a separate connection for recipes
    recipesConnection = await mongoose.createConnection(process.env.MONGODB_URI_RECIPES, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: 1, j: false },
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log("✅ Recipes MongoDB connected successfully")
    return recipesConnection
  } catch (error) {
    console.error("❌ Recipes MongoDB connection error:", error.message)
    throw error
  }
}

export const getRecipesConnection = () => {
  if (!recipesConnection) {
    throw new Error("Recipes DB connection not initialized. Call connectRecipesDB() first.")
  }
  return recipesConnection
}

export default getRecipesConnection




