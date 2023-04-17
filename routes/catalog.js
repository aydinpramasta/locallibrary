const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const bookinstanceController = require('../controllers/bookinstanceController');

router.get('/', bookController.index);

router.get('/books', bookController.list);
router.get('/book/create', bookController.create);
router.post('/book/create', bookController.store);
router.get('/book/:id', bookController.detail);
router.get('/book/:id/edit', bookController.edit);
router.post('/book/:id/edit', bookController.update);
router.get('/book/:id/delete', bookController.delete);
router.post('/book/:id/delete', bookController.destroy);

router.get('/authors', authorController.list);
router.get('/author/create', authorController.create);
router.post('/author/create', authorController.store);
router.get('/author/:id', authorController.detail);
router.get('/author/:id/edit', authorController.edit);
router.post('/author/:id/edit', authorController.update);
router.get('/author/:id/delete', authorController.delete);
router.post('/author/:id/delete', authorController.destroy);

router.get('/genres', genreController.list);
router.get('/genre/create', genreController.create);
router.post('/genre/create', genreController.store);
router.get('/genre/:id', genreController.detail);
router.get('/genre/:id/edit', genreController.edit);
router.post('/genre/:id/edit', genreController.update);
router.get('/genre/:id/delete', genreController.delete);
router.post('/genre/:id/delete', genreController.destroy);

router.get('/book-instances', bookinstanceController.list);
router.get('/book-instance/create', bookinstanceController.create);
router.post('/book-instance/create', bookinstanceController.store);
router.get('/book-instance/:id', bookinstanceController.detail);
router.get('/book-instance/:id/edit', bookinstanceController.edit);
router.post('/book-instance/:id/edit', bookinstanceController.update);
router.get('/book-instance/:id/delete', bookinstanceController.delete);
router.post('/book-instance/:id/delete', bookinstanceController.destroy);

module.exports = router;
