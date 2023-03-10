import { Component } from '@angular/core';
import {HttpService} from "../services/http.service";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  constructor(private service: HttpService) {
  }
  isSignedIn() {
    return this.service.isSignedIn()
  }

  signOut() {
    return this.service.signOut()
  }
}
