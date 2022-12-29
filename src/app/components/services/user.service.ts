import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./globar";


@Injectable()
export class UserService{

    public url:string;
    public identity: any;
    public token:any;

    constructor(private _http: HttpClient){
        this.url = global.url
    }

    register(user:any):Observable<any>{
        
        let params = JSON.stringify(user)

        let header = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params,{headers:header})
        
    }

    login(user:any, gettoken:boolean):Observable<any>{
        
     
        if (gettoken != false) {
            user.gettoken = gettoken
        }

        let param = JSON.stringify(user)

        let head = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', param, { headers: head })

    }

    getIdendity(){

        let identity = JSON.parse(localStorage.getItem('identity') || '{}')

        if (identity && identity != null && identity != "undefined") {
            this.identity = identity
            
        }else{
            this.identity =  null
        }


        return this.identity

    }

    gettoken(){

        let token = localStorage.getItem("token")

        if (token && token != null && token != undefined) {

            this.token = token
            
        }else{

            this.token = null
        }

        return this.token
    }

}