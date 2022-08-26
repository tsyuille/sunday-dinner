const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    instructions: {
        type: Array,
        required: true
    }, 
    cloudinaryId: {
        type: String,
        require: true,
      },
    category: {
        type: String,
        enum: ['Cookout', 'Baby Shower', 'Quick & Easy', 'Shindig', 'Sunday Dinner'],
        required: true
    },
    favorites: {
        type: Array, 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

recipeSchema.index({ name: 'text' })

module.exports = mongoose.model('Recipe', recipeSchema)