const async = require('async');
const {body, validationResult} = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

exports.list = (req, res, next) => {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec((err, genres) => {
            if (err) return next(err);

            res.render('genre/list', {
                title: 'Genre List',
                genres,
            });
        });
};

exports.detail = async (req, res, next) => {
    const [genre, genre_books] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}).exec(),
    ]).catch((error) => next(error));

    if (genre === null) {
        const error = new Error('Genre not found');
        error.status = 404;

        return next(error);
    }

    res.render('genre/detail', {
        title: 'Genre Detail',
        genre,
        genre_books,
    });
};

exports.create = (req, res) => {
    res.render('genre/form', {title: 'Create Genre'});
};

exports.store = [
    body('name', 'Genre name required')
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({name: req.body.name});

        if (!errors.isEmpty()) {
            res.render('genre/form', {
                title: 'Create Genre',
                genre,
                errors: errors.array(),
            });
            return;
        }

        Genre.findOne({name: req.body.name}).exec((err, genre_found) => {
            if (err) return next(err);

            if (genre_found) {
                res.redirect(genre_found.url);
                return;
            }

            genre.save((err) => {
                if (err) return next(err);

                res.redirect(genre.url);
            });
        });
    },
];

exports.edit = (req, res, next) => {
    Genre.findById(req.params.id).exec((err, genre) => {
        if (err) return next(err);

        if (genre === null) {
            err = new Error('Genre not found');
            err.status = 404;

            return next(err);
        }

        res.render('genre/form', {
            title: 'Update Genre',
            genre,
        });
    });
};

exports.update = [
    body('name', 'Genre name required')
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            _id: req.params.id,
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            res.render('genre/form', {
                title: 'Update Genre',
                genre,
                errors: errors.array(),
            });
            return;
        }

        Genre.findOne({name: req.body.name}).exec(async (err, genre_found) => {
            if (err) return next(err);

            if (genre_found) {
                res.redirect(genre_found.url);
                return;
            }

            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});

            res.redirect(updatedGenre.url);
        });
    },
];

exports.delete = async (req, res, next) => {
    const [genre, genre_books] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}).exec(),
    ]).catch((error) => next(error));

    if (genre === null) {
        res.redirect('/catalog/genres');
        return;
    }

    res.render('genre/delete', {
        title: 'Delete Genre',
        genre,
        genre_books,
    });
};

exports.destroy = async (req, res, next) => {
    const [genre, genre_books] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}).exec(),
    ]).catch((error) => next(error));

    if (genre_books.length > 0) {
        res.render('genre/delete', {
            title: 'Delete Genre',
            genre,
            genre_books,
        });
        return;
    }

    await Genre.findByIdAndRemove(req.params.id);

    res.redirect('/catalog/genres');
};
