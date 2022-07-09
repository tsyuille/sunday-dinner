const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required'
    }, 
    image: {
        type: String,
        required: 'This field is required'
    },
    ingredients: {
        type: Array,
        required: 'This field is required'
    },
    instructions: {
        type: Array,
        required: 'This field is required'
    }, 
    category: {
        type: String,
        enum: ['Cookout', 'Baby Shower', 'Quick & Easy', 'Shindig', 'Sundee Dinner'],
        required: 'This field is required'
    },
    likes: {
        type: Array,
        required: true,
      },
    favorites: {
        type: Array,
        required: true,
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

recipeSchema.index({ name: 'text' })

module.exports = mongoose.model('Recipe', recipeSchema)