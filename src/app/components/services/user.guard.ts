import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable()

export class UserGuard implements CanActivate{

    constructor(
        private _router:Router,
        private _userService: UserService
    ){

    }


    canActivate():any {

        let identity = this._userService.getIdendity()
      
        if (identity && identity.login) {

            return true;
            
        }else{
            this._router.navigate(['/login'])
            return false;
        }
        
    }
}