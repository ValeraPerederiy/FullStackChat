import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {webSocket} from 'rxjs/webSocket'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';
  value = "";
  username = '';
  messages:any[]=[];
  conected:boolean = false;
  subject:any
  $destroy:Subject<boolean> = new Subject<boolean>();
  constructor(private http:HttpClient){

  }
  ngOnInit(){
    
    
  }

  connect(){
    this.subject = webSocket('ws://localhost:5000')
    this.conected = true;
      const message = {
        event: 'connection',
        username: this.username,
        id: Date.now()
      }
      this.subject.next(message)

      this.subject.pipe(takeUntil(this.$destroy)).subscribe((msg:any)=>{
      //const message = JSON.parse(msg)
      this.messages.push(msg)
    });

  }
  sendMessage(value:string){
    const message = {
        username:this.username,
        message: value,
        id: Date.now(),
        event: 'message'
      }
      this.subject.next(message)
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

}
