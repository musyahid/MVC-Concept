const express = require('express')
const router = express.Router()

const CommentController = require('../controllers/CommentController')

router.get('/', CommentController.getComment)
router.post('/',CommentController.saveComment)
// router.get('/:id', )

module.exports = router

