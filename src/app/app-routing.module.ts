import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent} from "./home/home.component";
import {BoardComponent} from "./board/board.component";
import {BoardDetailComponent} from "./board-detail/board-detail.component";

const routes: Routes = [
  {
    path:'',
    component: HomeComponent,
  },
  {
    path: 'search/:game-search',
    component: HomeComponent,
  },
  {
    path: 'board',
    component: BoardComponent,
  },
  {
    path: 'board/:articleNo',
    component: BoardDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
