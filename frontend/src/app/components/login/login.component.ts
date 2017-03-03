/**
 * Component LoginComponent
 */

import {Component} from '@angular/core';
import { WebServerService } from './../../shared/services/src/web-server.service';

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls : ['./login.component.css'],
    providers:[WebServerService]
})
export class LoginComponent {
	constructor(private WebServerService: WebServerService){   }
	login={};
	Login(): void {
		this.WebServerService.EnviarDatos('/login',this.login,'get').subscribe(
            result => {
                console.log(result);
            },
            error => {                 
                if(<any>error !== null){
                    console.log(<any>error);
                    alert("Error en la petición");
                }
            }
        );
	    console.log(this.login);
	}

}