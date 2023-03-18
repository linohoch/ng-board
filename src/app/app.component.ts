import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {appLoaded} from "./core/board";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-board';
  //TODO 컴포넌트, 서비스 트리 정리
  constructor(private store: Store) {
  }
  ngOnInit(){
    this.store.dispatch(appLoaded());
  }
}
