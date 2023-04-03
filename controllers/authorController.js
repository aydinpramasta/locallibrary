const Author = require('../models/author');

exports.list = (req, res) => {
    res.send('NOT IMPLEMENTED: Author list');
};

exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
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
