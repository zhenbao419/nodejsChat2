//下面的顺序不要变 不然会出错
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.resolve('public')));//把public目录作为静态跟目录
app.use(express.static(path.resolve('app')));//把app目录作为静态跟目录
app.get('/',function(req,res){
    res.sendFile(path.resolve('app/index.html'))
});
app.listen(9090);