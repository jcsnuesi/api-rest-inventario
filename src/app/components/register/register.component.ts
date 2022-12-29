import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit{

  public title:string;
  public user:any;
  public status:any;
  public msg: any;

  constructor(
    private _userService: UserService
  ){

    this.title = "Register new user"
    this.user = new User('','','','','','ROLE_USER','')
  }

  ngOnInit():void{
   
 
  }


  onSubmit(form:any){
    console.log(this.user)
    this._userService.register(this.user).subscribe(

      response => {
        

        if (response.status == 'success') {
          this.status = response.status
          form.reset()
          
        }else{
          this.status = 'error'
        }

      },

      error =>{
        this.status = 'error'
        this.msg = error.error.message
        console.log(error)

      }
    )


  }

}


