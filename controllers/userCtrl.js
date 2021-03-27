const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../controllers/sendMail')
const upload = require('../middleware/upload')


const userCtrl = {
    getAllUsers: async (req, res) => {
        try {
            User
                .findAll({
                    attributes: {exclude: ['password']},
                    order: [['id', 'ASC']]})
                .then(users => {
                    return res.status(200).json({users})
                })
                .catch(err => {
                    return res.status(500).json({msg: err.message})
                })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await User.findOne({
                where: {id: req.params.user_id},
                attributes: {exclude: ['password']}
            })
            if(!user) return res.status(400).json({msg: "User with this id not found"})

            return res.status(200).json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createNewUser: async (req, res) => {
        try{
            const {login, email, password, fullName} = req.body
            const passwordHash = await bcrypt.hash(password, 12)
            const user = await User.create({
                login: login,
                email: email,
                password: passwordHash,
                fullName: fullName
            })
            sendMail(email)
            if(!user) return res.status(400).json({msg: "User not created"})
            return res.status(201).json({msg: "User created"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changeAvatar: async (req, res) => {
        try{
            if(req.file) {
                const user = await User.findOne({
                    where: {id: req.user.id}
                })
                if (!user)
                    return res.status(404).json({msg: "User not found"})
                await user.update({
                    profilePicture: req.file.path
                })
                return res.status(200).json({msg: "Avatar updated"})
            } else
                return res.status(400).json({msg: "File is not image"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {fullName, profilePicture} = req.body
            const user = await User.findOne({where: {id: req.params.user_id}})
            if(!user) return res.status(400).json({msg: "User not found"})
            await user.update(
                    {
                            fullName: fullName ? fullName : user.fullName,
                            profilePicture: profilePicture ? profilePicture : user.profilePicture
                        },
                {where: {id: user.id}}
            )
            return res.status(200).json({msg: "User data updated"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findOne({where: {id: req.params.user_id}})
            if(!user) return res.status(400).json({msg: "User not found"})
            await user.destroy()
            return res.status(200).json({msg: "User deleted"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = userCtrl