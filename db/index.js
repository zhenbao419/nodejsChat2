var mongoose = require('mongoose');
var config = require('../config');//与外面的数据库连接
//mongoose.connect('mongodb://localhost/nodejsChat');  地址固定
mongoose.connect(config.dbUrl);//与外面的数据库连接  可以地址变  这是一个对象 不要再里面写成字符串了


var UserSchema = new mongoose.Schema({
    email:String,
    avatar:String
});


var User = mongoose.model('User',UserSchema);
var ObjectId = mongoose.Schema.Types.ObjectId;//这句话是为了让下面的type:ObjectId能不报错
//把此用户模型进行导出   require("db").User  通过这句话在外面就可以用User了
exports.User = User;

var RoomSchema = new mongoose.Schema({
    name:String,
    users:[{type:ObjectId,ref:'User'}],//若是这么写的话就要再上面var ObjectId 要加上这句话
    messages:[{
        user:{type:ObjectId,ref:'User'},
        content:String,
        createAt:{type:Date,default:Date.now()}//发言的时间
    }]
});
var Room = mongoose.model('Room',RoomSchema);
exports.Room = Room;


/*
Room.create([{name:'JAVA'},{name:'JAVASCRIPT'}],function(err,result){
    console.log(arguments);
});*/
