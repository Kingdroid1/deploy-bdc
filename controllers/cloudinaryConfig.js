// const cloudinary = require('cloudinary');
// cloudinary.config({
// cloud_name: 'ebunola',
// api_key: '856989353684587',
// api_secret: 'NtFl-5VTHR4od7TJtKhlc1EydYg'
// });

// exports.uploads = (file) => {
//     return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result) =>{
//     resolve({url: result.url, id: result.public_id})
//     }, {resource_type: "auto"})
//     })
//     }

import { config, uploader } from 'cloudinary';
const cloudinary = () => config({
cloud_name: 'ebunola',
api_key:'856989353684587',
api_secret:'NtFl-5VTHR4od7TJtKhlc1EydYg',
});
export { cloudinary, uploader };