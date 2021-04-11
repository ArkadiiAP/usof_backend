const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/authAdmin')
const upload = require('../middleware/upload')

router.get('/myAccount', auth, userCtrl.getMyAccount)
router.get('/', userCtrl.getAllUsers)
router.get('/:user_id', auth, userCtrl.getUserById)
router.post('/', auth, adminAuth, userCtrl.createNewUser)
router.post('/avatar', upload.single('avatar'), auth, userCtrl.changeAvatar)
router.patch('/:user_id', auth, userCtrl.updateUser)
router.delete('/:user_id', auth, adminAuth, userCtrl.deleteUser)

module.exports = router
