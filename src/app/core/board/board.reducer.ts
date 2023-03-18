import {Action, createReducer, on} from "@ngrx/store";
import * as BoardActions from './board.actions'
import {BoardState, initialState} from "./board.state";

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
)


