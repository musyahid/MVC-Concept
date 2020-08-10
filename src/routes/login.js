const express = require('express')
const router = express.Router()

const AuthorController = require('../controllers/AuthorController')


router.get('/', AuthorController.getAuthor)
// router.get('/:id', AuthorController.getAuthorById)
// router.post('/',AuthorController.saveAuthor)
// router.delete('/:id',AuthorController.deleteAuthor)
// router.patch('/:id',AuthorController.updateAuthor)

module.exports = router

