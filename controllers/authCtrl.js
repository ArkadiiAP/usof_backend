const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sendMail = require('../controllers/sendMail')

const authCtrl = {
    register: async (req, res) => {
        try {
            const {login, email, password, fullName} = req.body

            if(!login || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid email."})

            let user = await User.findOne({where: {email: email}})
            if(user)
                return res.status(400).json({msg: "This email already exist."})
            else {
                user = await User.findOne({where: {login: login}})
                if(user)
                    return res.status(400).json({msg: "This login already exist."})
            }

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at list 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = {
                login, email, password: passwordHash, fullName
            }

            const activation_token = createActivationToken(newUser)  //токен для подтверждения email ри регистрации

            const mailOptions = {
                to: req.body.email,
                subject: 'Confirm email',
                text: `http://localhost:3000/activation/${activation_token}`
            }
            sendMail(mailOptions)

            res.status(200).json({msg: "Register Success! Please activate your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) =>{
      try {
          const {activation_token} = req.body
          const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
          console.log(user)

          const {login, email, password, fullName} = user

          let check = await User.findOne({where: {email: email}})
          if(check) return res.status(400).json({msg: "This email already exist."})
          else {
              check = await User.findOne({where: {login: login}})
              if(check) return res.status(400).json({msg: "This login already exist."})
          }

          await User.create({
              login: login,
              email: email,
              password: password,
              fullName: fullName
          })

          res.json({msg: "Account has been activated."})

      } catch (err) {
          return res.status(500).json({msg: err.message})
      }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email: email}})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user.id, role: user.role})
            console.log(refresh_token)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/auth/refresh_token',
                maxAge: 7*24*60*60*1000
            })

            res.json({msg: "Login successful."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: 'Please login'})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login"})

                const access_token = createAccessToken({id: user.id, role: user.role})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await User.findOne({where: {email: email}})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: user.id})

            const mailOptions = {
                to: req.body.email,
                subject: 'Reset password',
                text: `http://localhost:3000/resetPassword/${access_token}`
            }
            sendMail(mailOptions)
            res.status(200).json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const token = req.params.confirm_token
            if(!token) return res.status(400).json({msg: "Invalid authentication."})

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({msg: "Invalid authentication."})

                req.user = user
            })

            const {password} = req.body
            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at list 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await User.findOne({where: {id: req.user.id}})
            if(user){
                await user.update(
                    {password: passwordHash},
                    {where: {id: user.id}}
                )
            }

            res.status(200).json({msg: "Password changed successful"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/auth/refresh_token'})
            return res.status(200).json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = authCtrl