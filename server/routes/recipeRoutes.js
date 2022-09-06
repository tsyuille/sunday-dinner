const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const recipeController = require('../controllers/recipeController')
const { ensureAuth, ensureGuest } = require('../../middleware/auth')

// App Routes
router.get('/', recipeController.index)
router.get('/home', ensureAuth, recipeController.home)
router.get('/my-recipes', ensureAuth, recipeController.getRecipes)
router.get('/recipes/user/:userId', ensureAuth, recipeController.getUserRecipes)
router.get('/favorites', ensureAuth, recipeController.getFavorites)
router.get('/recipe/:id', recipeController.exploreRecipe)
router.get('/categories', recipeController.exploreCategories)
router.get('/latest', recipeController.exploreLatest)
router.get('/submit-recipe', recipeController.submitRecipe)
router.post('/submit-recipe', upload.single('file'), recipeController.submitRecipeOnPost)
router.post('/search', recipeController.searchRecipe)
router.put('/favoriteRecipe/:id', recipeController.favoriteRecipe)
router.delete('/deleteRecipe/:id', recipeController.deleteRecipe)

module.exports = router