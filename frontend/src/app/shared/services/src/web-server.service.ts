/**
 * Service WebServerService
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class WebServerService {
	urlBackend="http://localhost:5000/";
	constructor(private http:Http){
	}
	EnviarDatos(ruta:string,data:any,verbo:string){
		const headers = new Headers();
		headers.set('', '');
		headers.set('');
		if(verbo=='get'){
			return this.http.get(this.urlBackend,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}).map(res => res.json());
		}
		if(verbo=='post'){
			return this.http.post(this.urlBackend+ruta, data , headers).map(res => res.json());
		}
		if(verbo=='put'){
			return this.http.put(this.urlBackend+ruta, data , headers).map(res => res.json());
		}
		if(verbo=='delete'){
			return this.http.delete(this. urlBackend).map((res) => res.json());
		}
	}
}