import { Component, OnInit, DoCheck, EventEmitter, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/prodservice';
import { global } from '../services/globar';
import { Productos } from 'src/app/models/products';

@Component({
  selector: 'app-modal-ebay', 
  templateUrl: './modal-ebay.component.html',
  styleUrls: ['./modal-ebay.component.css'],
  providers: [UserService, ProductService]
})
export class ModalEbayComponent implements OnInit, DoCheck {
  public title:string;
  public status: any;
  public imgs:any;
  public inventary: Productos;
  public identity:any;
  public user:any;
  public classes:any;
  public token:any;
  public afuConfig;
  public resetVar:boolean;
  public url;

    constructor(
  
    private _userService:UserService,
    private _productService:ProductService

  ){ 
      this.classes = false;
      this.title = "Create new item"
      this.url = global.url
      this.token = this._userService.gettoken()
      this.user = this._userService.getIdendity()
      this.inventary = new Productos(this.user.login._id, '', '', '','','','','','','');
      this.resetVar = false
      this.afuConfig = {

        multiple: false,
        formatsAllowed: ".jpg, .jpeg, .png, .gif",
        maxSize: 50,
        uploadAPI: {
          url: this.url + "item-img",
         headers: {
            "Authorization": this.token
          }

        },
        theme: "attachPin",
        hideProgressBar: false,
        hideResetBtn: true,
        hideSelectBtn: false,
        attachPinBtn: 'Upload your avatar here!'

      }

  }

  ngOnInit(): void {
   
      this.status = false
  }
 

  ngDoCheck(): void {
    
    this.identity = localStorage.getItem("identity")
    this.token = localStorage.getItem('token')
    
    
    
  }
  
  avatarUpload(data: any) {
    let data_obj = data.body
    this.imgs = data_obj.response
    this.inventary.image = data_obj.response
    this.status = 'success'

   
  }
  newItem(item: any) {
   
    item.form.value.image = this.inventary.image
    
    this._productService.createItem(item.form.value, this.token).subscribe(

      response => {
        
        if (response.status == 'success') {
          
          item.reset()
          
          this.title = 'Item Created!!'
          this.status = 'success'
          setTimeout(() => {
            this.status = ''
            this.title = "Create new item"

          }, 1000);


        } else {

          this.status = 'error4'
        }

      },
      err => {
        this.status = 'error4'
        console.log(err)
      }
    )


  }


}


  


 