const async = require('async');
const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');

exports.index = (req, res) => {
    async.parallel(
        {
            book_count(callback) {
                Book.countDocuments({}, callback);
            },
            book_instance_count(callback) {
                BookInstance.countDocuments({}, callback);
            },
            book_instance_available_count(callback) {
                BookInstance.countDocuments({status: 'Available'}, callback);
            },
            author_count(callback) {
                Author.countDocuments({}, callback);
            },
            genre_count(callback) {
                Genre.countDocuments({}, callback);
            },
        },
        (err, results) => {
            res.render('index', {
                title: 'Local Library Home',
                error: err,
                data: results,
            });
        },
    );
};

exports.list = (req, res, next) => {
    Book.find({}, 'title author')
        .sort({title: 1})
        .populate('author')
        .exec((err, books) => {
            if (err) return next(err);

            res.render('book/list', {title: 'Book List', books});
        });
};

exports.detail = (req, res, next) => {
    async.parallel(
        {
            book(callback) {
                Book.findById(req.params.id)
                    .populate(['author', 'genre'])
                    .exec(callback);
            },
            book_instances(callback) {
                BookInstance.find({book: req.params.id}).exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            if (results.book === null) {
                err = new Error('Book not found');
                err.status = 404;

                return next(err);
            }

            res.render('book/detail', {
                title: 'Book Detail',
                book: results.book,
                book_instances: results.book_instances,
            });
        },
    );
};

exports.create = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create');
}

exports.store = (req, res) => {
    res.send('NOT IMPLEMENTED: Book store');
}

exports.edit = (req, res) => {
    res.send('NOT IMPLEMENTED: Book edit');
}

exports.update = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update');
}

exports.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete');
}

exports.destroy = (req, res) => {
    res.send('NOT IMPLEMENTED: Book destroy');
}
