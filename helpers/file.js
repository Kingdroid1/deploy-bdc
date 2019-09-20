const DataURI = require('datauri');
const path = require('path');

exports.fileToDataUri = (file) => {
    const dataUri = new DataURI();
    return dataUri.format(
        path.extname(file.originalname).toString(),
        file.buffer
    );
}