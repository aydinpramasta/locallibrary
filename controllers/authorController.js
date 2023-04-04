const Author = require('../models/author');
const async = require("async");
const Book = require("../models/book");

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
    res.send('NOT IMPLEMENTED: Author create');
}

exports.store = (req, res) => {
    res.send('NOT IMPLEMENTED: Author store');
}

exports.edit = (req, res) => {
    res.send('NOT IMPLEMENTED: Author edit');
}

exports.update = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update');
}

exports.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete');
}

exports.destroy = (req, res) => {
    res.send('NOT IMPLEMENTED: Author destroy');
}
