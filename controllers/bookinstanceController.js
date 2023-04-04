const BookInstance = require('../models/bookinstance');

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

exports.create = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance create');
}

exports.store = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance store');
}

exports.edit = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance edit');
}

exports.update = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance update');
}

exports.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance delete');
}

exports.destroy = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance destroy');
}
