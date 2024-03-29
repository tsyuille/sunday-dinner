require('../models/database')
const cloudinary = require('../../middleware/cloudinary')
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')


// GET /

exports.index = async(req, res) => {
    try{
        res.render('index', { layout: 'index' })
    }
    catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
}

// GET /home

exports.home = async(req, res) => {
    try{
        const limitNumber = 10
        // const categories = await Category.find({}).limit(limitNumber)
        const category = await Category.find({}).sort({ _id: -1 }).limit(limitNumber)
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
        const cookout = await Recipe.find({'category': 'Cookout'}).limit(limitNumber)
        const babyShower = await Recipe.find({'category': 'Baby Shower'}).limit(limitNumber)
        const quickEasy = await Recipe.find({'category': 'Quick & Easy'}).limit(limitNumber)
        const shindig = await Recipe.find({'category': 'Shindig'}).limit(limitNumber)
        const sunday = await Recipe.find({'category': 'Sunday Dinner'}).limit(limitNumber)

        const food = { latest, cookout, babyShower, quickEasy, shindig, sunday }

        res.render('home', { title: 'Sunday Dinner', /*categories,*/ category, recipe, food })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
} 

// GET /categories

exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20
        const categories = await Category.find({}).limit(limitNumber)
        const cookout = await Recipe.find({'category': 'Cookout'}).limit(limitNumber)
        const babyShower = await Recipe.find({'category': 'Baby Shower'}).limit(limitNumber)
        const quickEasy = await Recipe.find({'category': 'Quick & Easy'}).limit(limitNumber)
        const shindig = await Recipe.find({'category': 'Shindig'}).limit(limitNumber)
        const sunday = await Recipe.find({'category': 'Sunday Dinner'}).limit(limitNumber)
        const food = { cookout, babyShower, quickEasy, shindig, sunday }

        res.render('categories', { title: 'Sunday Dinner - Categories', categories, food })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }  
}

// GET /recipe/:id

exports.exploreRecipe = async(req, res) => {
    try{
        let recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        res.render('recipe', { title: 'Sunday Dinner - Recipe', recipe })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }  
}

// GET /submit

exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    res.render('submit-recipe', { title: 'Sunday Dinner - Submit Recipe', infoErrorsObj, infoSubmitObj  } )
}

// POST /submit-recipe

exports.submitRecipeOnPost = async(req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path)
  
      const newRecipe = new Recipe({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        category: req.body.category,
        user: req.user.id
      })
      
      await newRecipe.save()

      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/home')
    } catch (err) {
      console.log(err)
      res.redirect('/submit-recipe')
    }
  }

  // POST /search

  exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } })
      res.render('search', { title: 'Sunday Dinner - Search', recipe } )
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" })
    }
  }


// GET user recipes, favorites, delete  ADD UPDATE RECIPE OPTION??

      exports.getRecipes = async (req, res) => {
          try {
            const recipes = await Recipe.find({ user: req.user.id })
            .populate('user')
            .lean()
            res.render('my-recipes.ejs', { recipes: recipes, user:req.user })
        } catch(err) {
            console.error(err)
        }
      } 

       exports.getUserRecipes = async (req, res) => {
          try {
            const recipes = await Recipe.find({ user: req.params.userId })
            .populate('user')
            .lean()
            res.render('userRecipes.ejs', { recipes })
        } catch(err) {
            console.error(err)
        }
      } 

    exports.getFavorites = async (req, res) => {
          try {
            const recipes = await Recipe.find({})
            .populate('user')
            .lean()
            res.render('favorites.ejs', { recipes })
        } catch(err) {
            console.error(err)
        }
      }

    exports.favoriteRecipe = async (req, res) => {
          let favorited = false
          try {
            let recipe = await Recipe.findById({_id:req.params.id})
            favorited  = (recipe.favorites.includes(req.user.id))
          } catch(err){
          }
          //if already favorited, remove user from array
          if(favorited){
            try {
              await Recipe.findOneAndUpdate({_id:req.params.id},
                {
                  $pull : {'favorites' : req.user.id}
                })
                
                console.log('Removed user from favorites array')
                res.redirect('back')
              } catch(err){
                console.log(err)
              }
            }
            //else add user to favorites array
            else {
              try {
                await Recipe.findOneAndUpdate({_id:req.params.id},
                  {
                    $addToSet : {'favorites' : req.user.id}
                  })
                  
                  console.log('Added user to favorites array')
                  res.redirect(`back`)
              } catch(err){
                  console.log(err)
              }
            }
          }

    exports.deleteRecipe = async (req, res) => {
        try {
          // Get recipe by id
          let recipe = await Recipe.findById({ _id: req.params.id })
          await cloudinary.uploader.destroy(recipe.cloudinaryId)
          // Delete recipe from database
          await Recipe.remove({ _id: req.params.id })
          console.log('Deleted Recipe')
          res.redirect('/submit-recipe')
        } catch (err) {
          res.redirect('/my-recipes')
        }
      }