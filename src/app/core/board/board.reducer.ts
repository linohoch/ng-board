import {Action, createReducer, on} from "@ngrx/store";
import * as BoardActions from './board.actions'
import {BoardState, initialState} from "./board.state";
import {state} from "@angular/animations";
import {act} from "@ngrx/effects";
import {isRead, setReadArray} from "../../services/board.service";

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
  on(BoardActions.getDetail, (state) => {
    return ({...state, isLoading: true})
  }),
  on(BoardActions.getDetailSuccess, (state, action) => {
    setReadArray(action.detail.no)
    return ({
      ...state,
      isLoading: false,
      detail: action.detail
    })
  }),
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
  })),
  on(BoardActions.setArticle, (state, action)=>({
    ...state,
    detail: action.detail
  })),
  on(BoardActions.createSuccess, (state, action)=> ({
    ...state,
    isLoading: false,
    detail: action.detail
  })),
  on(BoardActions.createFailed, (state, action)=> ({
    ...state,
    isLoading: true,
    error: action.error
  })),

  on(BoardActions.deleteArticle, (state)=>({
    ...state,
    isLoading: true
  })),
  on(BoardActions.deleteSuccess, (state)=> ({
    ...state,
    isLoading: false,
  })),
  on(BoardActions.deleteFailed, (state, action)=> ({
    ...state,
    isLoading: true,
    error: action.error
  })),
  on(BoardActions.setEditedArticle, (state, action)=>({
    ...state,
    temp: action.temp
  })),
  on(BoardActions.editArticle, (state, action)=>({
    ...state,
    isLoading: true,
    detail: action.detail
  })),
  on(BoardActions.editSuccess, (state, action)=>({
    ...state,
    isLoading: false,
    detail: action.detail
  })),
  on(BoardActions.editFailed, (state, action)=>({
    ...state,
    isLoading: true,
    error: action.error
  })),
  on(BoardActions.getPermissionToEdit, (state, action)=>({
    ...state,
    isLoading: true,
    isPermit: false
  })),
  on(BoardActions.matchSuccess, (state, action)=>({
    ...state,
    isLoading: false,
    isPermit: true,
  })),
  on(BoardActions.matchFailed, (state, action)=>({
    ...state,
    isLoading: true,
    isPermit: false,
  })),



)


