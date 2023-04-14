import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {BoardComponent} from "./board/board.component";
import {BoardDetailComponent} from "./board-detail/board-detail.component";
import {AuthComponent} from "./auth/auth.component";
import {SignupComponent} from "./signup/signup.component";
import {BoardEditComponent} from "./board-edit/board-edit.component";
import {BoardCreateComponent} from "./board-create/board-create.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {UserAccountComponent} from "./user-account/user-account.component";

const routes: Routes = [
  {
    path:'',
    // component: HomeComponent,
    redirectTo: '/board',
    pathMatch: 'full',
  },
  {
    path: 'search/:game-search',
    component: HomeComponent,
  },
  // {
  //   path: 'board',
  //   redirectTo: 'board?page=1',
  // },
  {
    path: 'board',
    component: BoardComponent,
  },
  {
    path: 'board/new',
    component: BoardCreateComponent,
  },
  {
    path: 'article/:articleNo',
    component: BoardDetailComponent,
  },
  {
    path: 'article/:articleNo/edit',
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
  },
  {
    path: 'user/:user',
    title: '히스토리',
    component: UserDetailComponent,
    data: {
      reuseComponent: false
    }
  },
  {
    path: 'user',
    title: '회원계정',
    component: UserAccountComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
