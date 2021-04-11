const sequelise = require('../db/db')
const { DataTypes } = require('sequelize')
const Post = require('./postModel')
const Comment = require('./commentModel')
const Like = require('./likeModel')

const User = sequelise.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: "https://tleliteracy.com/wp-content/uploads/2017/02/default-avatar.png"
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    timestamps: true
})

User.hasMany(Post,{
    foreignKey: 'author',
    onDelete: "cascade"
})

User.hasMany(Comment, {
    foreignKey: 'author',
    onDelete: "cascade"
})

User.hasMany(Like, {
    foreignKey: 'author',
    onDelete: "cascade"
})

User.sync()

module.exports = User
