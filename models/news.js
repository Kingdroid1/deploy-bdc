const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    source: { type: Schema.Types.Mixed },
    title: { type: String },
    content: { type: String },
    description: { type: String },
    source_url: { type: Schema.Types.Mixed },
    featured_image_url: { type: String }
}, {
    timestamps: true,
    collection: 'news'
});

const News = mongoose.model ('News', newsSchema);
module.exports = News;
