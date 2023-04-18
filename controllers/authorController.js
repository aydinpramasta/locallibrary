const Author = require('../models/author');
const async = require("async");
const Book = require("../models/book");
const {body, validationResult} = require("express-validator");

exports.list = (req, res, next) => {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec((err, authors) => {
            if (err) return next(err);

            res.render('author/list', {
                title: 'Author List',
                authors,
            });
        });
};

exports.detail = (req, res, next) => {
    async.parallel(
        {
            author(callback) {
                Author.findById(req.params.id).exec(callback);
            },
            author_books(callback) {
                Book.find({author: req.params.id}, 'title summary').exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            if (results.author === null) {
                err = new Error('Author not found');
                err.status = 404;

                return next(err);
            }

            res.render('author/detail', {
                title: 'Author Detail',
                author: results.author,
                author_books: results.author_books,
            });
        },
    );
};

exports.create = (req, res) => {
    res.render('author/form', {title: 'Create Author'});
};

exports.store = [
    body('first_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth.')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death.')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);

        const {first_name, family_name, date_of_birth, date_of_death} = req.body;

        const author = new Author({first_name, family_name, date_of_birth, date_of_death});

        if (!errors.isEmpty()) {
            res.render('author/form', {
                title: 'Create Author',
                author,
                errors: errors.array(),
            });
            return;
        }

        author.save((err) => {
            if (err) return next(err);

            res.redirect(author.url);
        });
    },
];

exports.edit = (req, res, next) => {
    Author.findById(req.params.id).exec((err, author) => {
        if (err) return next(err);

        if (author === null) {
            err = new Error('Author not found');
            err.status = 404;

            return next(err);
        }

        res.render('author/form', {
            title: 'Update Author',
            author,
        });
    });
};

exports.update = [
    body('first_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth.')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death.')
        .optional({checkFalsy: true})
        .isISO8601()
        .toDate(),
    async (req, res, next) => {
        const errors = validationResult(req);

        const {first_name, family_name, date_of_birth, date_of_death} = req.body;

        const author = new Author({
            _id: req.params.id,
            first_name,
            family_name,
            date_of_birth,
            date_of_death,
        });

        if (!errors.isEmpty()) {
            res.render('author/form', {
                title: 'Update Author',
                author,
                errors: errors.array(),
            });
            return;
        }

        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, author, {});

        res.redirect(updatedAuthor.url);
    },
];

exports.delete = (req, res, next) => {
    async.parallel(
        {
            author(callback) {
                Author.findById(req.params.id).exec(callback);
            },
            booksByAuthor(callback) {
                Book.find({author: req.params.id}, "title summary").exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            if (results.author === null) {
                res.redirect('/catalog/authors');
                return;
            }

            res.render('author/delete', {
                title: 'Delete Author',
                author: results.author,
                booksByAuthor: results.booksByAuthor,
            });
        },
    );
};

exports.destroy = (req, res, next) => {
    async.parallel(
        {
            author(callback) {
                Author.findById(req.params.id).exec(callback);
            },
            booksByAuthor(callback) {
                Book.find({author: req.params.id}, "title summary").exec(callback);
            },
        },
        async (err, results) => {
            if (err) return next(err);

            const {author, booksByAuthor} = results;

            if (booksByAuthor.length > 0) {
                res.render('author/delete', {
                    title: 'Delete Author',
                    author,
                    booksByAuthor,
                });
                return;
            }

            await Author.findByIdAndRemove(req.body.authorId);

            res.redirect('/catalog/authors');
        },
    );
};
