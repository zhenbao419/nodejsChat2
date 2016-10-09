//下面的顺序不要变 不然会出错
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var User = require('./db').User;//这就是用index.js里面的那个User
var Room = require('./db').Room;
var app = express();
app.use(express.static(path.resolve('public')));//把public目录作为静态跟目录
app.use(express.static(path.resolve('app')));//把app目录作为静态跟目录
app.get('/',function(req,res){
    res.sendFile(path.resolve('app/index.html'))
});

/*
*   1.获取请求体对象  客户端传过来的请求体格式是JSON
* */
app.use(bodyParser.json());
app.post('/user/login',function(req,res){
    var email = req.body.email;
    var user = {email};
    User.findOne(user,function(err,doc){
        if(err){
            res.send({err:1,msg:'查询出错',data:err});
        }else{
            if(doc){
                res.send({err:0,msg:'成功',data:doc});
            }else{
                user.avatar = 'https://secure.gravatar.com/avatar/email?s=32';//头像
                User.create(user, function (err,doc2) {
                    if(err){
                        res.send({err:1,msg:'保存出错',data:err});
                    }else{
                        res.send({err:1,msg:'成功',data:doc2});
                    }
                })
            }
        }
    })
});

app.get ('/rooms',function(req,res){
   Room.find({},function(err,rooms){
       if(err){
           res.send({err:1,msg:'查询出错',data:err});
       }else{
           res.send({err:0,msg:'成功',data:rooms});
       }
   })
});
//增加房间的路由
app.post('/rooms',function(req,res){
    var room = req.body;
    room.users = room.messages = [];
    Room.create(room,function(err,doc){
        if(err){
            res.send({err:1,msg:'增加房间出错',data:err});
        }else{
            res.send({err:0,msg:'成功',data:doc});
        }
    })
});

app.get('/rooms/:id',function(req,res){
    Room.findById(req.params.id,function(err,room){
        if(err){
            res.send({err:1,msg:'查询房间出错',data:err});
        }else{
            res.send({err:0,msg:'成功',data:room});
        }
    })
});


var server=require('http').createServer(app);
/*
*
 * 监听客户端的socket.io请求
* */
var io= require('socket.io')(server);
io.on('connection',function(socket){
    socket.on('message',function(msgObj){
        msgObj.createAt = new Date();
       // console.log(msgObj);
        io.emit('message',msgObj);
    });

});
server.listen(9090);


/*
app.listen(9090);*/
