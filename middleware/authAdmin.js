const User = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({where: {id: req.user.id}})

        if(user.role !== 'admin')
            return res.status(500).json({msg: "Need admin rights"})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin
