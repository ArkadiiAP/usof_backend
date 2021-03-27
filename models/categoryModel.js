const sequelize = require('../db/db')
const { DataTypes } = require('sequelize')
// const Post = require('./postModel')
// const Post_Category = require('./post_categoryModel')

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

Category.sync()
// Category.belongsToMany(Post, {through: Post_Category})


module.exports = Category