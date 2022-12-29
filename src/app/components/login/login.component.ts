import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from 'src/app/models/user';
import {Router, ActivatedRoute, Params} from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public status:any;
  public ptitle:string;
  public user: User;
  public identity:any;
  public token:any
  
  


  constructor(
    private _userService: UserService,
    private _route: Router,
    private _ActidavtedRoutes: ActivatedRoute
  ){

    this.ptitle = "Welcome to Login"
    this.user = new User('','','','','','ROLE_USER','')

  }

ngOnInit(): void {
  
}

onSubmit(form: any){

  this._userService.login(this.user, false).subscribe(
    response => {
      
      console.log(response)
      if (response.login && response.login._id) {

        this.identity = response;

        localStorage.setItem("identity", JSON.stringify(this.identity))

        this._userService.login(this.user, true).subscribe(
          response => {

            if (response.token) {

              this.token = response.token
              localStorage.setItem("token", this.token)

              this.status = 'success'
              this._route.navigate(['/inicio'])

            } else {
              this.status = 'error'
            }

          },
          error =>{

            console.log(error)
         
            this.status = 'error';
          }
        )
        
      }else{
        
        this.status = 'error'
      }

     

    },
    error => {

      this.status = 'error'

      console.log(error)

     
    }
  )

  }

}
