import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {BoardComponent} from "./board/board.component";
import {BoardDetailComponent} from "./board-detail/board-detail.component";
import {AuthComponent} from "./auth/auth.component";
import {SignupComponent} from "./signup/signup.component";
import {BoardEditComponent} from "./board-edit/board-edit.component";

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
    redirectTo: 'board/1',
  },
  {
    path: 'board/:page',
    component: BoardComponent,
  },
  {
    path: 'board/article/:articleNo',
    component: BoardDetailComponent,
  },
  {
    path: 'board/article/:articleNo/edit',
    component: BoardEditComponent,
  },
  {
    path: 'login',
    title: '로그인',
    component: AuthComponent,
  },
  {
    path: 'signup',
    title: '회원가입',
    component: SignupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
