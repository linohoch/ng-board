import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {BoardComponent} from './board/board.component';
import {BoardDetailComponent} from './board-detail/board-detail.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpService} from "./services/http.service";
import {AuthComponent} from './auth/auth.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {SignupComponent} from './signup/signup.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {DialogComponent} from './dialog/dialog.component';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TransferService} from "./services/transfer.service";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers, metaReducers} from './core'
import {BoardEditComponent} from "./board-edit/board-edit.component";
import {BoardEffects} from "./core/board";
import { BoardCreateComponent } from './board-create/board-create.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent,
    BoardComponent,
    BoardDetailComponent,
    AuthComponent,
    SignupComponent,
    DialogComponent,
    BoardEditComponent,
    BoardCreateComponent,
  ],
  imports: [
    EffectsModule.forRoot([BoardEffects]),
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true
    }),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    MatPaginatorModule,
  ],
  // exports: [
  //   MatDialogModule
  // ],
  providers: [
    HttpService,
    TransferService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  bootstrap: [AppComponent,]
})
export class AppModule {
}
