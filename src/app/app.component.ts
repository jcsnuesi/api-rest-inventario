import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './components/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { global } from './components/services/globar';
import { ProductService } from './components/services/prodservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, ProductService]
})
export class AppComponent implements OnInit, DoCheck {
 public title = 'inventory_app';
 public identity:any;
 public token:any;
 public url:string;
 public search:any;
 public item:any;
 public imgs:any;
 public products: any;
 public status:any;

 constructor(
  private _userService: UserService,
  private _route:Router,
  private _ActivatedRoute: ActivatedRoute,
  private _productService: ProductService

 ){

  this.url = global.url
  this.identity = this._userService.getIdendity()
  this.token = this._userService.gettoken()
  this.search = {"search":""}
  


 }

 ngOnInit(): void {
   this.identity
   this.token 
  
 }

 ngDoCheck(): void {

   this.identity = this._userService.getIdendity()
   
 
 }

  newItem(item: any) {
    console.log(item.form.value)
    this._productService.createItem(item.form.value, this.token).subscribe(

      response => {
       
        if (response.status == 'success') {
         
          this.status = 'success'
          setTimeout(() => {
            this.status = ''
           
          }, 1000);

                   
        }else{

          this.status = 'error4'
        }

      },
      err => {
        this.status = 'error4'
        console.log(err)
      }
    )


  }


 logout():void{
  localStorage.clear()
  this.identity = null
  this.token = null
  this._route.navigate(['/'])
 }


  foundOnEbay(key: any) {
    

    this._productService.ebaySearch(this.search.search).subscribe(

      response => {

     
       
        if (response.status == 'success'){
         
          this.status = 'sucess'
          this.item = response.prodFound.itemSummaries
         
        }else{

          this.status = 'noFound'

        }      
     

      },
      err => {

        this.status = 'noFound'
        console.log(err)
       
      }
    )
  }


  


}
