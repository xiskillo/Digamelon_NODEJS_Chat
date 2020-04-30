

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type=text]').forEach(node => node.addEventListener('keypress', e => {
        if (e.keyCode == 13) {
            e.preventDefault();
            enviar_mensaje();
        }
    }))
});



const socket = io.connect();


var paquete = {
    nick: "",
    mensaje: ""
}

function conectar() {



    var nick = $('#login #nick').val();
    paquete.nick = nick;

    if (paquete.nick != "") {
        $("#usuarios_online").css("display", "block");
        socket.emit("nick", paquete.nick);
        swal("Bienvenid@ " + nick);
    } else {
        swal("EL NICK NO PUEDE ESTAR VACÍO");
        
    }

}


function enviar_mensaje() {
    if (paquete.nick != "") {

        var mensaje = $('#mensaje #texto').val();
        paquete.mensaje = mensaje;

        if (paquete.mensaje != "") {


            socket.emit("mensaje", { mensaje: paquete.mensaje, nick: paquete.nick });
            $('#mensaje #texto').val("");

        } else {

            swal("TU MENSAJE NO PUEDE ESTAR VACÍO");
        }


    } else {
        swal("PRIMERO TIENES QUE CONECTARTE");
    }


}


socket.on('onliners', function(data){
    $("#usuarios_online").css("display", "block");
    
    if (data == ""){
        
        $("#onliners").text( "NO HAY USUARIOS ONLINE" );
    }else{

        $("#onliners").text( data );
    }
    
});

socket.on('mensaje_recibido', function (data) {
    $("#chat").prepend("<p class='nick'>" + data.nick + ": " + "<spam class='mensaje'>" + data.mensaje + "</spam>" + "</p>");

});