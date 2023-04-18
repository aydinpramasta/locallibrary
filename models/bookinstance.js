const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const Schema = mongoose.Schema;

const bookInstanceSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, required: true},
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance',
    },
    due_back: {type: Date, default: Date.now},
});

bookInstanceSchema.virtual('url').get(function () {
    return `/catalog/book-instance/${this._id}`;
});

bookInstanceSchema.virtual('due_back_formatted').get(function () {
    return this.due_back
        ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
        : '';
});

bookInstanceSchema.virtual('due_back_form').get(function () {
    return this.due_back
        ? DateTime.fromJSDate(this.due_back).toFormat('yyyy-MM-dd')
        : '';
});

const BookInstance = mongoose.model('BookInstance', bookInstanceSchema);

module.exports = BookInstance;
