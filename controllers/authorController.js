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

exports.detail = async (req, res, next) => {
    const [author, author_books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]).catch((error) => next(error));

    if (author === null) {
        const error = new Error('Author not found');
        error.status = 404;

        return next(error);
    }

    res.render('author/detail', {
        title: 'Author Detail',
        author,
        author_books,
    });
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

exports.delete = async (req, res, next) => {
    const [author, author_books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]).catch((error) => next(error));

    if (author === null) {
        res.redirect('/catalog/authors');
        return;
    }

    res.render('author/delete', {
        title: 'Delete Author',
        author,
        author_books,
    });
};

exports.destroy = async (req, res, next) => {
    const [author, author_books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]).catch((error) => next(error));

    if (author_books.length > 0) {
        res.render('author/delete', {
            title: 'Delete Author',
            author,
            author_books,
        });
        return;
    }

    await Author.findByIdAndRemove(req.params.id);

    res.redirect('/catalog/authors');
};
