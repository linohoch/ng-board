import {Action, createReducer, on} from "@ngrx/store";
import * as BoardActions from './board.actions'
import {BoardState, initialState} from "./board.state";
import {state} from "@angular/animations";

export function reducer(state: BoardState | undefined, action: Action) {
  return BoardReducer(state, action)
}
const BoardReducer = createReducer(
  initialState,
  on(BoardActions.getArticles, (state) => ({...state, isLoading: true})),
  on(BoardActions.getArticlesSuccess, (state, action) => ({
    ...state,
    isLoading:false,
    articles:action.articles
  })),
  on(BoardActions.getArticlesFailed, (state, action) => ({
    ...state,
    isLoading:true,
    error:action.error
  })),
  on(BoardActions.getDetail, (state) => ({...state, isLoading: true})),
  on(BoardActions.getDetailSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    detail: action.detail
  })),
  on(BoardActions.getDetailFailed, (state, action) => ({
    ...state,
    isLoading: true,
    error: action.error
  })),
  on(BoardActions.getComments, (state) => ({...state, isLoading: true})),
  on(BoardActions.getCommentsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    commentList: action.commentList
  })),
  on(BoardActions.getCommentsFailed, (state, action) => ({
    ...state,
    isLoading: true,
    error: action.error
  })),
  
  on(BoardActions.setComment, (state, action)=>({
    ...state,
    comment: action.comment
  })),
  on(BoardActions.createComment, (state, action)=>({
    ...state,
    isLoading: true,
  })),
  on(BoardActions.createCommentSuccess, (state, action)=> ({
    ...state,
    isLoading: false,
    comment: action.comment
  })),
  on(BoardActions.createCommentFailed, (state, action)=> ({
    ...state,
    isLoading: true,
    error: action.error
  }))


)


