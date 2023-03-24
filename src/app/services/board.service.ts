import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Article} from "../data";
import {Comment, selectComment} from "../core/board";
import {select, Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  baseUrl='http://localhost:3000/api/v1/board'
  constructor(private http: HttpClient,
              private store: Store) {
  }

  getArticleList(){
    return this.http.get<Article[]>(`${this.baseUrl}/?page=1`,)
  }
  getArticleDetail(no: number){
    return this.http.get<Article>(`${this.baseUrl}/article/${no}`,{ withCredentials: true })
  }
  getComments(no: any) {
    return this.http.get<Comment[]>(`${this.baseUrl}/article/${no}/comment`)
  }

  createComment(comment: Comment){
    console.log('param: ',comment)
    this.store.pipe(select(selectComment)).subscribe(res=>
    console.log('state: ',res))
    return this.http.post<any>(`${this.baseUrl}/article/${comment.articleNo}/comment`,comment)
  }
}
