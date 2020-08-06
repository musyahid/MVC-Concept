const express = require('express')
const router = express.Router()

const AuthorController = require('../controllers/AuthorController')


router.get('/', AuthorController.getAuthor)
router.get('/:id', AuthorController.getAuthorById)
router.post('/',AuthorController.saveAuthor)

module.exports = router

