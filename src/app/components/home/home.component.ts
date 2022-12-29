import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {

  public user:any;
  public status:any;
  constructor(
  
  ){
    
  }

  ngOnInit(): void {

    
  }

  ngDoCheck(): void {
   
      this.user = JSON.parse(localStorage.getItem('identity') || '{}') 
   
    
   
  
  }

}
