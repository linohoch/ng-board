import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import articleList, {Article} from "../data";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  API= `http://localhost:3000/api/v1/board`

  constructor(private http: HttpClient) { }

  getArticleList(){
    return this.http.get<Article[]>(`${this.API}?page=1`)

  }
  getArticleDetail(no:number){
    // return this.http.get<Article>(String(no))
    // return articleList.find(article=> article.articleNo==no);

  }
}
