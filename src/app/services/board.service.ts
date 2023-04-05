import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Article, Comment, selectComment} from "../core/board";
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
  getArticleDetail(no: number, isRead: boolean | null){
    return this.http.get<Article>(`${this.baseUrl}/article/${no}?isRead=${isRead}`,{ withCredentials: true })
  }
  getComments(no: any) {
    return this.http.get<Comment[]>(`${this.baseUrl}/article/${no}/comment`)
  }

  createComment(comment: Comment){
    // console.log('param: ',comment)
    this.store.pipe(select(selectComment)).subscribe()
    return this.http.post<any>(`${this.baseUrl}/article/${comment.articleNo}/comment`,comment)
  }
  deleteComment(articleNo: any, commentNo: any){
    return this.http.delete<any>(`${this.baseUrl}/article/${articleNo}/comment/${commentNo}`)
  }
  updateArticle(editedArticle: Article) {
    return this.http.put<any>(`${this.baseUrl}/article/${editedArticle.no}`,editedArticle)
  }

  createArticle(detail: Article) {
    if(detail.userEmail==='anonymous'){
      return this.http.post<any>(`${this.baseUrl}/article/anny`, detail)
    }
    return this.http.post<any>(`${this.baseUrl}/article`, detail)
  }
  deleteArticle(no: number) {
    return this.http.delete<any>(`${this.baseUrl}/article/${no}`)
  }

  addLikeArticle(no: number) {
    return this.http.put<any>(`${this.baseUrl}/article/${no}/like?put=add`,'')
  }
  cancelLikeArticle(no: number) {
    return this.http.put<any>(`${this.baseUrl}/article/${no}/like?put=sub`,'')
  }
  addLikeComment(articleNo: number, commentNo: number) {
    return this.http.put<any>(`${this.baseUrl}/article/${articleNo}/comment/${commentNo}/like?put=add`,'')
  }
  cancelLikeComment(articleNo: number, commentNo: number) {
    return this.http.put<any>(`${this.baseUrl}/article/${articleNo}/comment/${commentNo}/like?put=sub`,'')
  }

  matchAnnyPassword(articleNo: string, pw: string) {
    return this.http.post(`${this.baseUrl}/anny/pw`, {no: articleNo, pw: pw})
  }
  deleteAnnyArticle(no: number) {
    return this.http.delete<any>(`${this.baseUrl}/article/anny/${no}`)
  }


}
export function setReadArray(no: number) {
  if(!isRead(no)){
    const read= localStorage.getItem('read')
    if(read===null){
      localStorage.setItem('read', JSON.stringify([no]))
    } else {
      const arr= JSON.parse(read)
      arr.push(no)
      localStorage.setItem('read', JSON.stringify(arr))
    }
  }
}
export function isRead(no:number): boolean {
  let read= localStorage.getItem('read')
  if(read!==null){
    let arr= JSON.parse(read)
    return arr.includes(Number(no))
  }
  return false
}
