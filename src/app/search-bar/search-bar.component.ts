import {Component, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {Article, selectArticles} from "../core/board";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit{
  me: string | undefined
  keyword: string | undefined
  articles: Article[] | undefined
  result: Article[] | undefined
  constructor(private service: HttpService,
              private router: Router,
              private store: Store) {
    this.store.pipe(select(selectArticles)).subscribe(next=>
      this.articles=next
    )
  }
  ngOnInit(): void {
  }
  search(resultEl: any){
    console.log(this.keyword)
    if(this.articles && this.keyword){
      this.result = this.articles.filter((article: any)=>{
        return article.title.search(String(this.keyword?.trim()))>-1 ||
          article.contents.search(String(this.keyword?.trim()))>-1
      })
      resultEl.style.display='block'
    }
    if(this.keyword?.trim().length===0){
      resultEl.style.display='none'
    }
  }
  myInfo() {
    const localUser = localStorage.getItem('user')
    if (localUser) {
      this.me = JSON.parse(localUser).username
      return true
    }
    return false
  }
  isSignedIn() {
    return this.service.isSignedIn()
  }

  signOut() {
    this.service.signOut().subscribe(() => {})
  }
  toggleDropdown(dropdown: any) {
    const state = dropdown.style.display
    dropdown.style.display=(state==='none')?'block':'none'
  }

}
