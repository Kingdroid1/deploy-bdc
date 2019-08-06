const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    featured_image_url: { type: String, required:true}
}, {
    timestamps: true,
    collection: 'news'
});

const News = mongoose.model ('News', newsSchema);
module.exports = News;

