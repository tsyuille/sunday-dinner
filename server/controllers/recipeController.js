require('../models/database')
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')
const user = require('../models/User')


// GET /

exports.index = async(req, res) => {
    try{
        res.render('index', { title: 'Sundee Dinner' })
    }
    catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
}

// GET /home

exports.home = async(req, res) => {
    try{
        const limitNumber = 10
        const categories = await Category.find({}).limit(limitNumber)
        const category = await Category.find({}).sort({ _id: -1 }).limit(limitNumber)
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
        const cookout = await Recipe.find({'category': 'Cookout'}).limit(limitNumber)
        const babyShower = await Recipe.find({'category': 'Baby Shower'}).limit(limitNumber)
        const quickEasy = await Recipe.find({'category': 'Quick & Easy'}).limit(limitNumber)
        const shindig = await Recipe.find({'category': 'Shindig'}).limit(limitNumber)
        const sundee = await Recipe.find({'category': 'Sundee Dinner'}).limit(limitNumber)

        const food = { latest, cookout, babyShower, quickEasy, shindig, sundee }

        res.render('home', { title: 'Sundee Dinner', categories, category, recipe, food })
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
        const sundee = await Recipe.find({'category': 'Sundee Dinner'}).limit(limitNumber)
        const food = { cookout, babyShower, quickEasy, shindig, sundee }

        res.render('categories', { title: 'Sundee Dinner - Categories', categories, food })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }  
}

//GET /categories/:id

exports.exploreCategoriesById = async(req, res) => {
    try{
        let categoryId = req.params.id
        const limitNumber = 20
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber)
        res.render('categories', { title: 'Sundee Dinner - Categories', categoryId })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }  
}

// GET /recipe/:id

exports.exploreRecipe = async(req, res) => {
    try{
        let recipeId = req.params.id
        const recipe = await Recipe.findById(recipeId)
        res.render('recipe', { title: 'Sundee Dinner - Recipe', recipe, user })
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }  
}

// GET /latest

exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 5
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber)
      res.render('latest', { title: 'Sundee Dinner - Explore Latest', recipe } )
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" })
    }
} 

// GET /submit

exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    res.render('submit-recipe', { title: 'Sundee Dinner - Submit Recipe', infoErrorsObj, infoSubmitObj  } )
}

// POST /submit-recipe

exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile
      let uploadPath
      let newImageName
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.')
      } else {
  
        imageUploadFile = req.files.image
        newImageName = Date.now() + imageUploadFile.name
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err)
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        image: newImageName,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        category: req.body.category,
        // user: req.user.id
      })
      
      await newRecipe.save()

      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/home')
    } catch (err) {
      //res.json(error)
      //req.flash('infoErrors', error)
      console.log(err)
      res.redirect('/submit-recipe')
    }
  }

  // POST /search

  exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } })
      res.render('search', { title: 'Sundee Dinner - Search', recipe } )
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" })
    }
  }


// GET user recipes, favorites, likes, delete option ADD UPDATE RECIPE OPTION??

    exports.getRecipes = async (req, res) => {
        try {
          const recipes = await Recipe.find({ user: req.user.id });
          res.render('my-recipes.ejs', { recipes: recipes, user: req.user })
        } catch (err) {
          console.log(err)
        }
      }

    exports.getFavorites = async (req, res) => {
        try {
          const recipes = await Recipe.find({ user: req.user.id });
          res.render('favorites.ejs', { recipes: recipes, user: req.user });
        } catch (err) {
          console.log(err)
        }
      }

    exports.likePost = async (req, res)=>{
        let liked = false
        try{
          let recipe  = await Recipe.findById({_id:req.params.id})
          liked = (recipe.likes.includes(req.user.id))
        } catch(err){
        }
        //if already liked, remove user from likes array
        if(liked){
          try{
            await Recipe.findOneAndUpdate({_id:req.params.id},
              {
                $pull : {'likes' : req.user.id}
              })
              
              console.log('Removed user from likes array')
              res.redirect('back')
            }catch(err){
              console.log(err)
            }
          }
          //else add user to like array
          else{
            try{
              await Recipe.findOneAndUpdate({_id:req.params.id},
                {
                  $addToSet : {'likes' : req.user.id}
                })
                
                console.log('Added user to likes array')
                res.redirect(`back`)
            }catch(err){
                console.log(err)
            }
          }
        }

    exports.favoriteRecipe = async (req, res) => {
          let favorited = false
          try{
            let recipe = await Recipe.findById({_id:req.params.id})
            favorited  = (recipe.favorites.includes(req.user.id))
          } catch(err){
          }
          //if already favorited, remove user from likes array
          if(favorited){
            try{
              await Recipe.findOneAndUpdate({_id:req.params.id},
                {
                  $pull : {'favorites' : req.user.id}
                })
                
                console.log('Removed user from favorites array')
                res.redirect('back')
              }catch(err){
                console.log(err)
              }
            }
            //else add user to favorites array
            else{
              try{
                await Recipe.findOneAndUpdate({_id:req.params.id},
                  {
                    $addToSet : {'favorites' : req.user.id}
                  })
                  
                  console.log('Added user to favorites array')
                  res.redirect(`back`)
              }catch(err){
                  console.log(err)
              }
            }
          }
    exports.deletePost = async (req, res) => {
        try {
          // Find post by id
          let recipes = await Recipe.findById({ _id: req.params.id })
          // Delete post from db
          await Recipe.remove({ _id: req.params.id });
          console.log('Deleted Recipe');
          res.redirect('/submit-recipe');
        } catch (err) {
          res.redirect('/submit-recipe');
        }
      }