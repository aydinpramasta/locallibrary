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

exports.detail = (req, res, next) => {
    async.parallel(
        {
            genre(callback) {
                Genre.findById(req.params.id).exec(callback);
            },
            genre_books(callback) {
                Book.find({genre: req.params.id}).exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            if (results.genre === null) {
                err = new Error('Genre not found');
                err.status = 404;

                return next(err);
            }

            res.render('genre/detail', {
                title: 'Genre Detail',
                genre: results.genre,
                genre_books: results.genre_books,
            });
        },
    );
};

exports.create = (req, res) => {
    res.render('genre/form', {title: 'Create Genre'});
}

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

        Genre.findOne({name: req.body.name}).exec((err, genreFound) => {
            if (err) return next(err);

            if (genreFound) {
                res.redirect(genreFound.url);
                return;
            }

            genre.save((err) => {
                if (err) return next(err);

                res.redirect(genre.url);
            });
        });
    },
];

exports.edit = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre edit');
}

exports.update = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update');
}

exports.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete');
}

exports.destroy = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre destroy');
}
