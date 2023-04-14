import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-board-side',
  templateUrl: './board-side.component.html',
  styleUrls: ['./board-side.component.scss']
})
export class BoardSideComponent implements OnInit{
  @Input() data: Observable<any> | undefined

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.data)
  }

}
