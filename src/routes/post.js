const express = require('express')
const router = express.Router()

const PostController = require('../controllers/PostController')

router.get('/',PostController.getPost)
router.get('/:id', PostController.getPostById)
router.post('/',PostController.savePost)
// router.get('/:id', )

module.exports = router

