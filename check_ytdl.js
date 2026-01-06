const youtubedl = require('youtube-dl-exec');
console.log(Object.keys(youtubedl));
if (youtubedl.create) console.log('Has create method');
