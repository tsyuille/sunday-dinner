const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const { ensureAuth } = require('../../middleware/auth')

// App Routes
router.get('/', recipeController.index)
router.get('/home', recipeController.home)
router.get('/my-recipes', ensureAuth, recipeController.getRecipes)
router.get('/favorites', ensureAuth, recipeController.getFavorites);
router.get('/recipe/:id', recipeController.exploreRecipe)
router.get('/categories', recipeController.exploreCategories)
router.get('/categories/:id', recipeController.exploreCategoriesById)
router.get('/latest', recipeController.exploreLatest)
router.get('/submit-recipe', recipeController.submitRecipe)
router.post('/submit-recipe', recipeController.submitRecipeOnPost)
router.post('/search', recipeController.searchRecipe)
// router.put('/likePost/:id', recipeController.likePost)
router.put('/favoriteRecipe/:id', recipeController.favoriteRecipe)
router.delete('/deletePost/:id', recipeController.deletePost)

module.exports = router