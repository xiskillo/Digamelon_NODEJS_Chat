var express = require('express');
var app = express();
var http = require('http')
var server = http.createServer(app);

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://xiskillo:ocsix@digamelon-pwlny.mongodb.net/test', {useNewUrlParser: true});


server.listen(3000)

app.use(express.static('public'));

var socketio = require('socket.io');
var io = socketio.listen(server);



var usuarios = [];
var onliners = [];


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONEXION MONGO SATISFACTORIA");
});


io.on('connect', function (socket) {
    console.log("CLIENTE CONECTADO: " + socket.id);


    io.emit("onliners",onliners.join(" | "));      

    

    socket.on("nick", function (data) {


        console.log("EL SIGUIENTE USUARIO SE HA CONECTADO: " + data);

        var existe_nick = -1;
        for (var index = 0; index < usuarios.length; index++) {
           
    
            if (usuarios[index].id.toString() == socket.id.toString()){               
                
                existe_nick = index;
    
            }
                
    
            
        }

        if (existe_nick == -1){
            usuarios.push(
                {
                    id: socket.id,
                    nick: data
                }
            );
        }else{

            usuarios[existe_nick].nick = data;
        }
        
       

        onliners = [];
        for (let index = 0; index < usuarios.length; index++) {
           onliners.push(usuarios[index].nick);
            
        }



        io.emit("onliners",onliners.join(" | "));
        console.log("DATOS DE USUARIOS: " + JSON.stringify(usuarios));
    })

    socket.on("mensaje", function (data) {

        console.log("MENSAJE RECIBIDO: ", data);
        io.emit("mensaje_recibido", data);
    })

    socket.on('disconnect' , function(data){
        console.log("data " + data);
        console.log("CLIENTE DESCONECTADO: " + socket.id);
        actualizar_onliners(socket.id); 
        io.emit("onliners",onliners.join(" | "));       
        
       
    });

});



function actualizar_onliners(cliente){
    var i = -1;
    console.log("el array mide: " + usuarios.length);

    do{
    for (var index = 0; index < usuarios.length; index++) {
        console.log("el id A" + usuarios[index].id);
        console.log("el id B" + cliente);
        console.log(index);

        if (usuarios[index].id.toString() == cliente.toString()){
           
            usuarios.splice(index,1);
        console.log("hubo SLICE: " + JSON.stringify(usuarios));

        }else{
            i = -1;
        }
            

        
    }
}while(i>-1);

    console.log("estado de  la variabele " + i);

    
    onliners = [];
    for (let index = 0; index < usuarios.length; index++) {
       onliners.push(usuarios[index].nick);
        
    }

    
    
}


