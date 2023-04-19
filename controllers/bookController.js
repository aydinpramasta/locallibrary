const async = require('async');
const {body, validationResult} = require('express-validator');
const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');

exports.index = async (req, res) => {
    const [
        book_count,
        book_instance_count,
        book_instance_available_count,
        author_count,
        genre_count,
    ] = await Promise.all([
        Book.countDocuments(),
        BookInstance.countDocuments(),
        BookInstance.countDocuments({status: 'Available'}),
        Author.countDocuments(),
        Genre.countDocuments(),
    ]).catch((error) => {
        res.render('index', {
            title: 'Local Library Home',
            error,
        });
    });

    const data = {
        book_count,
        book_instance_count,
        book_instance_available_count,
        author_count,
        genre_count,
    };

    res.render('index', {
        title: 'Local Library Home',
        data,
    });
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

exports.detail = async (req, res, next) => {
    const [book, book_instances] = await Promise.all([
        Book.findById(req.params.id)
            .populate(['author', 'genre'])
            .exec(),
        BookInstance.find({book: req.params.id}).exec(),
    ]).catch((error) => next(error));

    if (book === null) {
        const error = new Error('Book not found');
        error.status = 404;

        return next(error);
    }

    res.render('book/detail', {
        title: 'Book Detail',
        book,
        book_instances,
    });
};

exports.create = async (req, res, next) => {
    const [authors, genres] = await Promise.all([
        Author.find(),
        Genre.find(),
    ]).catch((error) => next(error));

    res.render('book/form', {
        title: 'Create Book',
        authors,
        genres,
    });
};

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
    async (req, res, next) => {
        const errors = validationResult(req);

        const {title, author, summary, isbn, genre} = req.body;

        const book = new Book({title, author, summary, isbn, genre});

        if (!errors.isEmpty()) {
            const [authors, genres] = await Promise.all([
                Author.find(),
                Genre.find(),
            ]).catch((error) => next(error));

            for (const genre of genres) {
                if (book.genre.includes(genre._id)) {
                    genre.checked = 'true';
                }
            }

            res.render('book/form', {
                title: 'Create Book',
                authors,
                genres,
                book,
                errors: errors.array(),
            });
            return;
        }

        book.save((err) => {
            if (err) return next(err);

            res.redirect(book.url);
        })
    }
];

exports.edit = async (req, res, next) => {
    const [book, authors, genres] = await Promise.all([
        Book.findById(req.params.id)
            .populate(['author', 'genre'])
            .exec(),
        Author.find(),
        Genre.find(),
    ]).catch((error) => next(error));

    if (book === null) {
        const error = new Error('Book not found');
        error.status = 404;

        return next(error);
    }

    for (const genre of genres) {
        for (const book_genre of book.genre) {
            if (genre._id.toString() === book_genre._id.toString()) {
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
};

exports.update = [
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre !== 'undefined'
                ? [req.body.genre]
                : [];
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
            const [authors, genres] = await Promise.all([
                Author.find(),
                Genre.find(),
            ]).catch((error) => next(error));

            for (const genre of genres) {
                if (book.genre.indexOf(genre._id) > -1) {
                    genre.checked = "true";
                }
            }

            res.render('book/form', {
                title: 'Update Book',
                authors,
                genres,
                book,
                errors: errors.array(),
            });
            return;
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, book);

        res.redirect(updatedBook.url);
    },
];

exports.delete = async (req, res, next) => {
    const [book, book_instances_by_book] = await Promise.all([
        Book.findById(req.params.id)
            .populate(['author', 'genre'])
            .exec(),
        BookInstance.find({book: req.params.id}).exec(),
    ]).catch((error) => next(error));

    if (book === null) {
        res.redirect('/catalog/books');
        return;
    }

    res.render('book/delete', {
        title: 'Delete Book',
        book,
        book_instances_by_book,
    });
};

exports.destroy = (req, res, next) => {
    async.parallel(
        {
            book(callback) {
                Book.findById(req.params.id).exec(callback);
            },
            bookInstancesByBook(callback) {
                BookInstance.find({book: req.params.id}).exec(callback);
            },
        },
        async (err, results) => {
            if (err) return next(err);

            const {book, bookInstancesByBook} = results;

            if (bookInstancesByBook.length > 0) {
                res.render('book/delete', {
                    title: 'Delete Book',
                    book,
                    bookInstancesByBook,
                });
                return;
            }

            await Book.findByIdAndRemove(req.body.bookId);

            res.redirect('/catalog/books');
        },
    );
};
