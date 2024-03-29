import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {appLoaded} from "./core/board";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ng-board';
  constructor(private store: Store,
              private router: Router) {
  }
  routerEvents: any
  previousURL: string = '';
  currentURL: string = '';
  ngOnInit(){
    this.store.dispatch(appLoaded());
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousURL = this.currentURL;
        this.currentURL = event.url;
        console.log(`[${this.previousURL}]->[${this.currentURL}]`)
      }
    });
  }
  ngOnDestroy(): void {
    this.routerEvents.unsubscribe();
  }
}
