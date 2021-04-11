const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get('/', categoryCtrl.getAllCategoriesWithPagination)
router.get('/all', auth, categoryCtrl.getAllCategories)
router.get('/:category_id', auth, categoryCtrl.gerCategoryById)
router.get('/:category_id/posts', auth, categoryCtrl.getPostsByCategoryId)
router.post('/', auth, categoryCtrl.createNewCategory)
router.patch('/:category_id', auth, authAdmin, categoryCtrl.updateCategoryById)
router.delete('/:category_id', auth, authAdmin, categoryCtrl.deleteCategoryById)

module.exports = router