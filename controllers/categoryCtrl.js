const Category = require('../models/categoryModel')
const Post = require('../models/postModel')
const Post_Category = require('../models/post_categoryModel')

const categoryCtrl = {
    getAllCategoriesWithPagination: async (req, res) => {
        try {
            await Category.findAndCountAll({
                limit: 4,
                offset: req.query.page * 4 - 4
            }).then(result => {
                return res.status(200).json(result)
            })
        }
         catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllCategories: async (req, res) => {
        try {
            await Category.findAll()
              .then(result => {
                  return res.status(200).json(result)
              })
        } catch (err){
            return res.status(500).json({msg: err.message})
        }
    },
    gerCategoryById: async (req, res) => {
        try {
            const category = await Category.findOne({
                where: {id: req.params.category_id}
            })
            if(!category)
                return res.status(400).json({msg: "Category with this id does not exist"})
            return res.status(200).json(category)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPostsByCategoryId: async (req, res) => {
        try {
            const posts = await Post.findAndCountAll({
              limit: 4,
              offset: req.query.page * 4 - 4,
                include: [{
                    model: Category,
                    where: {id: req.params.category_id},
                    as: "categories"
                }]
            })
            if(!posts)
                return res.status(404).json({msg: "Category with this id does not exist"})
            return res.status(200).json(posts)
        }  catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createNewCategory: async (req, res) => {
        try {
            const { title, description } = req.body
             const category = await Category.findOne({
                where: {title: title}
            })
            if(category)
                return res.status(400).json({msg: "This category already exist"})
            await Category.create({
                title: title,
                description: description
            })
            return res.status(200).json({msg: "Category created"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategoryById: async (req, res) => {
        try {
            const { title, description } = req.body
            const category = await Category.findOne({
                where: {id: req.params.category_id}
            })
            if(!category)
                return res.status(400).json({msg: "Category with this id does not exist"})
            await category.update({
                title: title,
                description: description ? description : category.description
            })
            return res.status(200).json({msg: "Category updated"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategoryById: async (req, res) => {
        try {
            await Category.destroy({
                where: {id: req.params.category_id}
            })
            return res.status(200).json({msg: "Category deleted"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl
