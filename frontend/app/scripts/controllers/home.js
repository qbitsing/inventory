  'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
.controller('HomeCtrl', function ($scope) {
	/*$scope.conexion=false;
	$scope.operacion=0;
	$scope.tipos=['','Abierto correctamente','Trasmitido correctamente','Falló al transmitir','Fuera de validez','No posee privilegios para abrir','Acceso denegado, fuera de zonas horarias permitidas','Error del código del sistema','Este usuario esta en lista negra','Error de comunicación'];
	var ws = new WebSocket("ws://127.0.0.1:12656");
	ws.onopen = function(){
		Materialize.toast("Socket conectado", 4000);
        $scope.conexion=true; 
    };
    ws.onmessage = function(message) {
    	var obj=JSON.parse(message.data);
    	if (obj.result) {
	    	$scope.datos=obj.data;
			var mensaje='<ul>';
			var titulo='';
            if ($scope.operacion=='1') {
                $scope.operacion='2';
                sendRequest({"cmd":"openserialport","data":{}});
            }else if ($scope.operacion=='2') {
                titulo="Todo listo!";
                mensaje+='<li>El aplicativo esta listo para la comunicación con los dispositivos</li>';
            }else if ($scope.operacion=='3') {
    			titulo='Información de la llave';
                mensaje+='<li>ID: '+$scope.datos.id+'</li>';
                if ($scope.datos.activationtime) {
	               mensaje+='<li>Fecha de activación: '+Ordenarfecha($scope.datos.activationtime);+'</li>'; 
                }
	            mensaje+='<li>Lista negra: '+($scope.datos.blacklistflag || 'No')+'</li>';
                if ($scope.datos.expirytime) {
    			 mensaje+='<li>Fecha de expiración: '+Ordenarfecha($scope.datos.expirytime);+'</li>';   
                }
    			mensaje+='<li>Tipo: '+$scope.datos.type+'</li>';
    		}else if ($scope.operacion=='4') {
                if ($scope.datos.eventlist) {
        			if ($scope.datos.eventlist.length>0) {
        				mensaje+='<li>El historial de la llave pendiente por descargar es el siguiente:</li>';
        				mensaje+='<table>';
        				mensaje+='<th>ID. Candado</th>';
        				mensaje+='<th>ID. Llave</th>';
        				mensaje+='<th>Hora</th>';
        				mensaje+='<th>Resultado</th>';
        				$scope.datos.eventlist.forEach(function(ele, index){
        					mensaje+='<tr>';
        					mensaje+='<td>'+ele.lockid+'</td>';
        					mensaje+='<td>'+ele.userid+'</td>';
        					mensaje+='<td>'+Ordenarfecha(ele.time)+'</td>';
        					mensaje+='<td>'+ObtenerStatus(ele.type)+'</td>';
        					mensaje+='</tr>';
        				});
        				mensaje+='</table>';
        			}else{
        				mensaje+='<li>La llave no posee historial pendiente por descargar</li>';
        			}
                }else{
                    mensaje+='<li>La llave esta en blanco</li>';
                }
            }else if ($scope.operacion=='5') {
                titulo="Formato exitoso";
                mensaje+='<li>La llave ha sido formateada exitosamente</li>';
            }else if($scope.operacion=='6'){
                titulo="Registro exitoso";
                mensaje+='<li>La llave de emergencia ha sido registrada exitosamente</li>';
            }else if ($scope.operacion=='7'){
                titulo="Información transmitida";
                mensaje+='<li>La información esta lista para transmitirse, ahora ponga la llave en el candado para descargarla</li>';
            }else if($scope.operacion=='8'){
            	titulo="Llave de usuario programada";
                mensaje+='<li>La llave de usuario ha sido programada</li>';
            }
            mensaje+='</ul>';
            swal({
                title: titulo,
                text: mensaje,
                type: "success",
                html: true
            });
        }else{
            sweetAlert("Oops...", obj.data.error , "error");
        }
    };
    function sendRequest(request) {
      	ws.send(JSON.stringify(request));
    };
    function Ordenarfecha(fecha){
        var contador=0;
        var year=0;
        var fecha_nueva='20';
        for (var i = 0; i<fecha.length;i++) {
            contador++;
            if (contador<3) {
                year++;
                fecha_nueva+=fecha.charAt(i);
            }else{
                if (year>5 && year<7) {
                    fecha_nueva+=' ';
                }else if((year>7 && year<9) ||(year>9 && year<11)){
                    fecha_nueva+=':';
                }else{
                    fecha_nueva+='/';
                }
                contador=0;
                i--;
            }
        }
        return fecha_nueva;
    }
    function ObtenerStatus(tipo){
        return $scope.tipos[tipo];
    }
    $scope.leerLlave=function(){
    	if ($scope.conexion) {
    		$scope.operacion='3';
    		sendRequest({"cmd": "readkey", "data": {"syscode": "36363636", "regcode":"31313131","beep":true}});
    	}else{
    		sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
    	}
    }
    $scope.leerHistorial=function(){
    	if ($scope.conexion) {
    		$scope.operacion='4';
    		sendRequest({"cmd": "readkeyevent", "data": {"syscode": "36363636", "regcode":"31313131","beep":true}});
    	}else{
    		sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
    	}
    }
    $scope.crearLlaveEmergencia=function(){
    	if ($scope.conexion) {
    		$scope.operacion='6';
    		sendRequest({"cmd": "createemergencykey", "data": {"syscode": "36363636","regcode": "31313131", "id": 65535, "activationtime": moment().format('YYMMDDHHmm'),"expirytime":moment().add(2, 'years').format('YYMMDDHHmm'),"beep":true}});
    	}else{
    		sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
    	}
    }
    $scope.crearLlaveBlanco=function(){
        if ($scope.conexion) {
            $scope.operacion='5';
            sendRequest({"cmd": "createblankkey", "data": {"syscode": "36363636", "regcode":"31313131", "id": 1, "newsyscode":"36363636"," Newregcode ":"31313131","beep":true}});
        }else{
            sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
        }
    }
    $scope.crearCandado=function(){
        if ($scope.conexion) {
            $scope.operacion='7';
            sendRequest({"cmd": "createsettingkey", "data": {"syscode": "36363636","regcode": "31313131","activationtime": moment().format('YYMMDDHHmm'),"expirytime":moment().add(2, 'years').format('YYMMDDHHmm'), "id": 5, "newlockid": 26, "newlockgroupid":333,"beep":true}});
        }else{
            sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
        }
    }
    $scope.iniciarPuerto=function(){
        if ($scope.conexion) {
            $scope.operacion='1';
            sendRequest({"cmd":"registersdk","data":{"code":"62C80BF1A5127EBF6567776780CB6B760F0324558229DFC44D76115B1DFEE4492A36BA8126FE668DFB106AA5CAAD076F19740F398688C182A07A2C40149B617B6D9B175C568434C5A66E5B5256AD20E09AEA8A83A2307478813C29FC41A73A512AC00FC2359B6E9E48B4707C4E426F095D643254040683CF6240B87E6C9088DA"}});
        }else{
            sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
        }
    }
    $scope.crearLlaveUsuario=function(){
    	if ($scope.conexion) {
            $scope.operacion='8';
    		sendRequest({"cmd":"createuserkey","data":{"syscode":"36363636","regcode":"31313131","id":12,"groupid":333,"beep":true,"timezonelist":[{"id":1,"count":1,"list":[{"id":1,"begin":"0001","end":"2359","mo":1,"tu":1,"we":1,"th":1,"fr":1,"sa":1,"su":1,"h":1,"s1":1,"s2":1}]}],"calendaryear":"2017","activationtime":"1706291832","expirytime":"1906291832","addplanlist":[{"id":26,"type":"lock","timezoneid":1}]}});
    	}else{
            sweetAlert("Oops...", "No se ha podido hacer conectar con el socket" , "error");
        }
    }*/
})
