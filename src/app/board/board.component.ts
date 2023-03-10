import {Component, OnInit} from '@angular/core';
import {Article} from "../data";
import {HttpService} from "../services/http.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  articleList: Article[] | undefined

  constructor(private service: HttpService) {
  }

  ngOnInit(): void {
    this.service.getArticleList().subscribe((articles:Article[])=>{
      this.articleList=articles;
    })
  }


}
