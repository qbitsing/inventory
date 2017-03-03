"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service WebServerService
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var WebServerService = (function () {
    function WebServerService(http) {
        this.http = http;
        this.urlBackend = "http://localhost:5000/";
    }
    WebServerService.prototype.EnviarDatos = function (ruta, data, verbo) {
        var headers = new http_1.Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');
        if (verbo == 'get') {
            return this.http.get(this.urlBackend + ruta, headers).map(function (res) { return res.json(); });
        }
        if (verbo == 'post') {
            return this.http.post(this.urlBackend + ruta, data, headers).map(function (res) { return res.json(); });
        }
        if (verbo == 'put') {
            return this.http.put(this.urlBackend + ruta, data, headers).map(function (res) { return res.json(); });
        }
        if (verbo == 'delete') {
            return this.http.delete(this.urlBackend).map(function (res) { return res.json(); });
        }
    };
    return WebServerService;
}());
WebServerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], WebServerService);
exports.WebServerService = WebServerService;
//# sourceMappingURL=web-server.service.js.map