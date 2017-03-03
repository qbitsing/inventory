
import {Component} from "@angular/core";
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {LoginComponent} from './components/login/index';
import { WebServerService } from './shared/services/src/web-server.service';

@Component({
    selector: 'app',
    moduleId: module.id,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers:[WebServerService],
})
@RouteConfig([
    {path: '/', name: 'Login', component: LoginComponent},
    {path: '**', name: 'Login', component: LoginComponent}
])
export class AppComponent {

}