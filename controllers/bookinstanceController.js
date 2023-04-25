const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const {body, validationResult} = require('express-validator');
const async = require("async");
const Author = require("../models/author");

exports.list = (req, res, next) => {
    BookInstance.find()
        .populate('book')
        .exec((err, bookInstances) => {
            if (err) return next(err);

            res.render('book-instance/list', {
                title: 'Book Instance List',
                bookInstances,
            });
        });
};

exports.detail = (req, res, next) => {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec((err, bookInstance) => {
            if (err) return next(err);

            if (bookInstance === null) {
                err = new Error('Book copy not found');
                err.status = 404;

                return next(err);
            }

            res.render('book-instance/detail', {
                title: `Copy: ${bookInstance.book.title}`,
                bookInstance,
            });
        });
};

exports.create = (req, res, next) => {
    Book.find({}, 'title').exec((err, books) => {
        if (err) return next(err);

        res.render('book-instance/form', {
            title: 'Create Book Instance',
            books,
        });
    });
};

exports.store = [
    body('book', 'Book must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);

        const {book, imprint, status, due_back} = req.body;

        const bookInstance = new BookInstance({book, imprint, status, due_back});

        if (!errors.isEmpty()) {
            Book.find({}, 'title').exec(function (err, books) {
                if (err) return next(err);

                res.render('book-instance/form', {
                    title: 'Create Book Instance',
                    books,
                    bookInstance,
                    selectedBook: bookInstance.book._id,
                    errors: errors.array(),
                });
            });

            return;
        }

        bookInstance.save((err) => {
            if (err) return next(err);

            res.redirect(bookInstance.url);
        });
    },
];

exports.edit = async (req, res, next) => {
    const [bookInstance, books] = await Promise.all([
        BookInstance.findById(req.params.id).populate('book').exec(),
        Book.find({}, 'title').exec(),
    ]).catch((error) => next(error));

    if (bookInstance === null) {
        const error = new Error('Book copy not found');
        error.status = 404;

        return next(error);
    }

    res.render('book-instance/form', {
        title: `Update Book Instance: ${bookInstance._id}`,
        bookInstance,
        selectedBook: bookInstance.book._id,
        books,
    });
};

exports.update = [
    body('book', 'Book must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    async (req, res, next) => {
        const errors = validationResult(req);

        const {book, imprint, status, due_back} = req.body;

        const bookInstance = new BookInstance({
            _id: req.params.id,
            book,
            imprint,
            status,
            due_back,
        });

        if (!errors.isEmpty()) {
            Book.find({}, 'title').exec(function (err, books) {
                if (err) return next(err);

                res.render('book-instance/form', {
                    title: `Update Book Instance: ${bookInstance.book.title}`,
                    books,
                    bookInstance,
                    selectedBook: bookInstance.book._id,
                    errors: errors.array(),
                });
            });

            return;
        }

        const updatedBookInstance = await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});

        res.redirect(updatedBookInstance.url);
    },
];

exports.delete = (req, res, next) => {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec((err, bookInstance) => {
            if (err) return next(err);

            if (bookInstance === null) {
                res.redirect('/catalog/book-instances');
                return;
            }

            res.render('book-instance/delete', {
                title: `Delete Book Instance: ${bookInstance.book.title}`,
                bookInstance,
            });
        });
};

exports.destroy = async (req, res) => {
    await BookInstance.findByIdAndRemove(req.params.id);

    res.redirect('/catalog/book-instances');
};
