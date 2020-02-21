var shortUrl = require('node-url-shortener');


function UrlShortener(url){

var imageUrl='';

shortUrl.short(url, function(err, result){
    console.log(result);
    imageUrl = result;

});


console.log(imageUrl);
return imageUrl;
}

module.exports={
    UrlShortener, 
}