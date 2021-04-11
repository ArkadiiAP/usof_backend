const router = require('express').Router()
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get('/:comment_id', auth, commentCtrl.getCommentById)
router.get('/:comment_id/like', auth, commentCtrl.getAllLikesByCommentId)
router.post('/:comment_id/like', auth, commentCtrl.createNewLikeByCommentId)
router.patch('/:comment_id', auth, commentCtrl.updateCommentById)
router.delete('/:comment_id', auth, commentCtrl.deleteCommentById)
router.delete('/:comment_id/like', auth, commentCtrl.deleteLikeByCommentId)


module.exports = router