import {createFeatureSelector, createSelector} from "@ngrx/store";
import {BoardState} from "./board.state";
import {createComment} from "./board.actions";

export const selectBoard = createFeatureSelector<BoardState>('board')

export const selectIsLoading = createSelector(
  selectBoard,
  (state: BoardState) => state.isLoading
)
export const selectError = createSelector(
  selectBoard,
  (state: BoardState) => state.error
)
export const selectArticles = createSelector(
  selectBoard,
  (state: BoardState) => state.articles
)
export const selectArticlesExceptDeleted = createSelector(
  selectBoard,
  (state:BoardState) => state.articles.filter(article=>{return !article.isDelete})
)

export const selectDetail = createSelector(
  selectBoard,
  (state: BoardState) => state.detail
)
export const selectCommentList = createSelector(
  selectBoard,
  (state: BoardState) => state.commentList
)
export const selectComment = createSelector(
  selectBoard,
  (state: BoardState) => state.comment
)

export const selectTemp = createSelector(
  selectBoard,
  (state: BoardState) => state.temp
)
export const selectIsPermit = createSelector(
  selectBoard,
  (state: BoardState) => state.isPermit
)
// export const selectDetailFromStore =(no:number)=> { createSelector(
//     selectBoard,
//     (state) => state.articles.find((detail) => detail.no === no))
// }
