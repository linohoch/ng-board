import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import articleList, {Article} from "../data";
import {HttpService} from "../services/http.service";

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  // providers: [HttpService]
})
export class BoardDetailComponent implements OnInit{
  article: Article | undefined;
  commentList: any | undefined;

  constructor(private route: ActivatedRoute,
              private service: HttpService) {

  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const articleNoFromRoute = Number(routeParams.get('articleNo'));

    // this.article=articleList.find(article=> article.articleNo===articleNoFromRoute);
    this.service.getArticleDetail(articleNoFromRoute).subscribe((article)=> {
      this.article=article;
    })
  }

}
