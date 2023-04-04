const async = require('async');
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
    res.send('NOT IMPLEMENTED: Genre create');
}

exports.store = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre store');
}

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
