import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/prodservice';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { global } from '../services/globar';
import { UserService } from '../services/user.service';
import * as $ from "jquery"
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [ProductService, UserService]
})
export class InventoryComponent implements OnInit{

  public title:string;
  public identity:any;
  public products:any;
  public token:any;
  public status:any;
  public url:string;
  public searchs:any;
  public total_page: any;
  public page: any;
  public prev_page: any;
  public next_page: any;
  public number_pages: any;
  public nopaginate;
  
  
  constructor(
    private _productService: ProductService,
    private _userService:UserService,
    private _activatedRoute: ActivatedRoute
  ){
    this.title =  "Inventory section"
    this.url = global.url
    this.nopaginate = false;
  }

  ngOnInit(): void {
    
    
    this.identity = this._userService.getIdendity()
    this.token = this._userService.gettoken()
    
    this._activatedRoute.params.subscribe(params => {

      var page =  +params['page']
      console.log(page)
      if (!page) {
        page = 1
        this.prev_page = 1
        this.next_page = 2
        
      }

      this.onSubmit(page)
    })
    
  }

  onSubmit(page = 1){

    this._productService.getProdPage(page).subscribe(
      response => {
     
        if (response.status == 'success') {
          
          this.products = response.products
         
           //Navegacion de la paginacion
          this.total_page = response.totalPages
         
           var number_pages = []

          for (let i = 1; i < this.total_page + 1; i++) {
            number_pages.push(i)
          
            
           }
          
           this.number_pages =  number_pages

           if (page >=2) {

             this.prev_page = page - 1
            
           }else{
             this.prev_page = 1
           }

           if (page < this.total_page) {
            this.next_page = page + 1
           }else{
            this.next_page = this.total_page
           }
                  
        }else{
          this.status = 'error'
        }
      
      },
      error => {
        console.log(error)
      }
    )

  } 

  images (image:any ){

    let img = ''
  
    let resp = image.some((x:any) => x.includes("https"))

    
    if (image.length == 0) {
      img = '../../../assets/resources/nopic.png'
    } else if (resp){
      img = image[0]
     
    }else{
      img = this.url + 'prod-img/' + image
    }

    return img
  }

  ExpDateKey(date:any){

    let newFormatDate = ''

    if (date.expireDateOrmfd.expDate != undefined ) {

      newFormatDate = date.expireDateOrmfd.expDate

    }else{
      newFormatDate = 'n/a'
    }

   
   return newFormatDate.substring(0,10)
  }

  mfdKey(date: any) {

    let newFormatDate = ''

    if (date.expireDateOrmfd.mfd) {

      newFormatDate = date.expireDateOrmfd.mfd

    } else {
      newFormatDate = 'n/a'
    }
    
    return newFormatDate.substring(0, 10)
  }

  searchProducts(){
    
    this._productService.search(this.searchs).subscribe(

      response => {
        
     
        if (response.status == 'success') {
          this.status = 'success'
          this.products = response.prods
        }else{

          this.status = 'error1'
        }
        

      },
      err => {
        this.status = 'error1'
        console.log(err)

      }
    )

  }

  update(data:any){

    this._productService.updateProducts(data.form.value, this.token).subscribe(

      response => {

      
        if (response.status == 'success') {

          this.status = 'success'
              
          }else{
          this.status = 'error2'
          }
      },
      err =>{
        this.status = 'error2'
        console.log(err)
      }
    )

  }

  itemDel(id:any){
    console.log(id)
    this._productService.deleteItem(id, this.token).subscribe(
     
      response => {
        console.log(response)
        if (response.status == 'deleted') {

          this.status = 'deleted'

          setTimeout(() => {
            this.status = ''
          }, 1000);
          
        }
        else{
          this.status = 'error3'
        }
      
      },
      err => {
        this.status = 'error3'
        console.log(err)
      }
    )


  }
  
 

    
  
}

