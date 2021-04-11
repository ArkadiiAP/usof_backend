const sequelize = require('../db/db')
const { DataTypes } = require('sequelize')
const Post = require('./postModel')
const Category = require('./categoryModel')

const Post_Category = sequelize.define("Post_Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: false })

Post_Category.sync()

Post.belongsToMany(Category, {
    through: Post_Category,
    as: "categories",
    foreignKey: "post_id",
    otherKey: "category_id"
})
Category.belongsToMany(Post, {
    through: Post_Category,
    as: "posts",
    foreignKey: "category_id",
    otherKey: "post_id"
})


module.exports = Post_Category
