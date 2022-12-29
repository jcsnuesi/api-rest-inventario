import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./globar";


@Injectable()
export class ProductService{

    public url: string;
    public identity:any;
    public token:any;

    constructor(
        private _http:HttpClient,
        
    ){

        this.url = global.url

    }

    createItem(item:any, token:any):Observable<any>{

        let params = JSON.stringify(item)
     
      
        let head = new HttpHeaders().set('Content-Type','application/json').set('Authorization', token)
      
        return this._http.post(this.url + 'additem', params,{headers:head})

    }
    getprods():Observable<any>{

        let head = new HttpHeaders().set('Content-Type','application/json')
        
        return this._http.get(this.url + 'get-products', {headers:head})
    }

    getProdPage(page = 1):Observable<any>{
        return this._http.get(this.url + 'prod-page/' + page)
    }
    search(keyword:any):Observable<any>{
       
        
        let head =  new HttpHeaders().set('Content-Type','application/json')
        
        return this._http.get(this.url + 'find-prod/' + keyword, {headers:head})
    }

    updateProducts(dataToUpdate:any, token:any):Observable<any>{

        let params = JSON.stringify(dataToUpdate)
      
        let head = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token)
        
        return this._http.put(this.url + 'update-item', params,{headers:head})
    }

    deleteItem(id:any, token:any):Observable<any>{

        let head = new HttpHeaders().set('Content-Type','application/json').set('Authorization',token)

        return this._http.delete(this.url + 'delete/' + id,{headers:head})
    }
    ebaySearch(key: any): Observable<any> {

        let head = new HttpHeaders().set('Content-Type','application/json')
        
        return this._http.get(this.url + 'ebay-search/'+ key,{headers:head})
    }



}

