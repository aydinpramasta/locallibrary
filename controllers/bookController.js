const async = require('async');
const {body, validationResult} = require('express-validator');
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

exports.create = (req, res, next) => {
    async.parallel(
        {
            authors(callback) {
                Author.find(callback);
            },
            genres(callback) {
                Genre.find(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            res.render('book/form', {
                title: 'Create Book',
                authors: results.authors,
                genres: results.genres,
            });
        },
    );
}

exports.store = [
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre !== 'undefined'
                ? [req.body.genre]
                : [];
        }

        next();
    },
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('isbn', 'ISBN must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('genre.*').escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const {title, author, summary, isbn, genre} = req.body;

        const book = new Book({title, author, summary, isbn, genre});

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    authors(callback) {
                        Author.find(callback);
                    },
                    genres(callback) {
                        Genre.find(callback);
                    },
                },
                (err, results) => {
                    if (err) return next(err);

                    for (const genre of results.genres) {
                        if (book.genre.includes(genre._id)) {
                            genre.checked = 'true';
                        }
                    }

                    res.render('book/form', {
                        title: 'Create Book',
                        authors: results.authors,
                        genres: results.genres,
                        book,
                        errors: errors.array(),
                    });
                },
            );

            return;
        }

        book.save((err) => {
            if (err) return next(err);

            res.redirect(book.url);
        })
    }
];

exports.edit = (req, res, next) => {
    async.parallel(
        {
            book(callback) {
                Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(callback);
            },
            authors(callback) {
                Author.find().exec(callback);
            },
            genres(callback) {
                Genre.find().exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err);

            const {book, authors, genres} = results;

            if (book === null) {
                err = new Error('Book not found');
                err.status = 404;

                return next(err);
            }

            for (const genre of genres) {
                for (const bookGenre of book.genre) {
                    if (genre._id.toString() === bookGenre._id.toString()) {
                        genre.checked = 'true';
                    }
                }
            }

            res.render('book/form', {
                title: 'Update Book',
                book,
                authors,
                genres,
            });
        },
    );
}

exports.update = [
    (req, res, next) => {
        if (!req.body.genre instanceof Array) {
            if (typeof req.body.genre === "undefined") {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    body("title", "Title must not be empty.")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("author", "Author must not be empty.")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("isbn", "ISBN must not be empty.")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("genre.*").escape(),
    async (req, res, next) => {
        const errors = validationResult(req);

        const {title, author, summary, isbn, genre} = req.body;

        const book = new Book({
            _id: req.params.id,
            title,
            author,
            summary,
            isbn,
            genre,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    authors(callback) {
                        Author.find().exec(callback);
                    },
                    genres(callback) {
                        Genre.find().exec(callback);
                    },
                },
                (err, results) => {
                    if (err) return next(err);

                    const {authors, genres} = results;

                    for (const genre of genres) {
                        if (book.genre.indexOf(genre._id) > -1) {
                            genre.checked = "true";
                        }
                    }

                    res.render('book/form', {
                        title: 'Update Book',
                        book,
                        authors,
                        genres,
                        errors: errors.array(),
                    });
                },
            );

            return;
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});

        res.redirect(updatedBook.url);
    },
];

exports.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete');
}

exports.destroy = (req, res) => {
    res.send('NOT IMPLEMENTED: Book destroy');
}
