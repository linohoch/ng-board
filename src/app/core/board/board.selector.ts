import {createFeatureSelector, createSelector} from "@ngrx/store";
import {BoardState} from "./board.state";

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
// export const selectDetailFromStore =(no:number)=> { createSelector(
//     selectBoard,
//     (state) => state.articles.find((detail) => detail.no === no))
// }

export const selectDetail = createSelector(
  selectBoard,
  (state:BoardState) => state.detail
)
