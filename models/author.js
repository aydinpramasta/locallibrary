const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

authorSchema.virtual('name').get(function () {
    let fullName = '';

    if (this.first_name && this.family_name) {
        fullName = `${this.first_name} ${this.family_name}`;
    }

    if (!this.first_name || !this.family_name) {
        fullName = '';
    }

    return fullName;
});

authorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`;
});

authorSchema.virtual('lifespan').get(function () {
    const date_of_birth_formatted = this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
        : '';

    const date_of_death_formatted = this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
        : '';

    return `${date_of_birth_formatted} - ${date_of_death_formatted}`;
});

authorSchema.virtual('date_of_birth_form').get(function () {
    return this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toFormat('yyyy-MM-dd')
        : '';
});

authorSchema.virtual('date_of_death_form').get(function () {
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toFormat('yyyy-MM-dd')
        : '';
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
