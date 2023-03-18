import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Article} from "../data";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  baseUrl='http://localhost:3000/api/v1/board'
  constructor(private http: HttpClient) {
  }

  getArticleList(){
    return this.http.get<Article[]>(`${this.baseUrl}/?page=1`)
  }
  getArticleDetail(no: number){
    return this.http.get<Article>(`${this.baseUrl}/article/${no}`)
  }
}
