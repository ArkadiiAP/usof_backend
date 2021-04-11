const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const auth = require('../middleware/auth')

router.post('/register', authCtrl.register)
router.post('/activation', authCtrl.activateEmail)
router.post('/login', authCtrl.login)
router.post('/refresh_token', authCtrl.getAccessToken)
router.post('/resetPassword', authCtrl.forgotPassword)
router.post('/resetPassword/:confirm_token', authCtrl.resetPassword)
router.post('/logout', authCtrl.logout)

module.exports = router