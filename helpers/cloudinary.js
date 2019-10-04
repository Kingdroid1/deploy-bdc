const { config, v2 } = require('cloudinary');

const cloudinaryConfig = () => config({
    cloud_name: 'bdc-naija',
    api_key: '984779179471927',
    api_secret:'a0yDKpaT6RxhqEJl4MRFoeTAhM0',
});

const uploader = v2.uploader;

module.exports = { cloudinaryConfig, uploader };