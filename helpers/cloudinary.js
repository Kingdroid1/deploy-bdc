const { config, v2 } = require('cloudinary');

const cloudinaryConfig = () => config({
    cloud_name: 'ebunola',
    api_key: '856989353684587',
    api_secret:'NtFl-5VTHR4od7TJtKhlc1EydYg',
});

const uploader = v2.uploader;

module.exports = { cloudinaryConfig, uploader };