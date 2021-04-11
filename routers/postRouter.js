const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get('/', postCtrl.getAllPosts)
router.get('/:post_id', postCtrl.getPostById)
router.get('/:post_id/comments', postCtrl.getCommentsByPostId)
router.post('/:post_id/comments', auth, postCtrl.createCommentToPostById)
router.get('/:post_id/categories', postCtrl.getCategoriesByPostId)
router.get('/:post_id/like', auth, postCtrl.getAllLikesByPostId)
router.post('/', auth, postCtrl.createPost)
router.post('/:post_id/like', auth, postCtrl.createNewLikeByPostId)
router.patch('/:post_id', auth, postCtrl.updatePostById)
router.delete('/:post_id', auth, postCtrl.deletePostById)
router.delete('/:post_id/like', auth, postCtrl.deleteLikeByPostId)

module.exports = router
