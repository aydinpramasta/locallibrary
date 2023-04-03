const Genre = require('../models/genre');

exports.list = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre list');
};

exports.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
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
