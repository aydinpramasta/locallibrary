const Book = require('../models/book');

exports.index = (req, res) => {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.list = (req, res) => {
    res.send('NOT IMPLEMENTED: Book list');
};

exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
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
