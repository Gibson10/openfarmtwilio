var shortUrl = require('node-url-shortener');


function UrlShortener(url){
return new Promise(function (resolve,reject){
shortUrl.short(url, function(err, result){
    console.log(result);
    resolve(result);
});

reject(err)
    })
}

module.exports={
    UrlShortener, 
}