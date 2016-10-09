angular.module('chatMod').controller('RoomCtrl',function($routeParams,$scope,$http,$rootScope){
    /*
    *    1.在控制器中注入 $routeParams，这是一个对象，key是路径占位符，值就是路径里占位符对应的字符串
    *    2.拼出url /rooms /真是id 调用后台接口得到room对象
    *    3.后台编写一个路由响应这个请求 app.get("/rooms/:_id")
    *    4.通过Room模型的findById方法传入id，得到room对象并返回给客户端
    *    5.客户端拿到room赋给$scope.room
    * */
    var roomId = $routeParams.id;//房间id
    $http({
        url:`/rooms/${roomId}`,
        method:'GET'
    }).success(function(result){
       if(result.err == 0){
           $scope.room = result.data;
       } else{
           $rootScope.errorMsg= result.msg;
       }
    });


    /*
    *    1.在后台引入socket.io,监听客户端的连接请求
    *    2.在前台连接后台的socket.io服务器
    *    3. 在前台发送消息给后台，后台保存到当前房间里messages数组中，并且通过所有的客户端添加此消息
    * */

    var socket = io.connect('ws://localhost:9090');
    socket.on('message',function(msgObj){
        $scope.room.messages.push(msgObj);
    });
    $scope.send = function(){
        var content = $scope.content;
        socket.send({user:$rootScope.user._id,content:$scope.content});
    }


});

angular.module('chatMod').directive('keyDown',function(){
    return {

    }
})