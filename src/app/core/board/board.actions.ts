import {createAction, props} from "@ngrx/store";
import {Article} from "../../data";
import {Comment} from "./board.state";

export const appLoaded = createAction("[APP] App Loaded")

/**
 *  board
 */
export const getArticles = createAction(
  "[Board page] get articles"
)

export const getArticlesSuccess = createAction(
  "[Board API] Fetch ArticleList Success",
  props<{ articles: Article[] }>()
)

export const getArticlesFailed = createAction(
  "[Board API] Fetch ArticleList Failed",
  props<{ error: any }>()
)

/**
 *  board-detail
 */
export const getDetail = createAction(
  "[Board-detail page] get article detail",
  props<{ no: any }>()
)

export const getDetailSuccess = createAction(
  "[Board API] Fetch Article Success",
  props<{ detail: Article }>()
)

export const getDetailFailed = createAction(
  "[Board API] Fetch Article Failed",
  props<{ error: any }>()
)

export const getComments = createAction(
  "[Board-detail page] get article comments",
  props<{ no: any }>()
)
export const getCommentsSuccess = createAction(
  "[Board API] Fetch Article comments Success",
  props<{ commentList: Comment[] }>()
)
export const getCommentsFailed = createAction(
  "[Board API] Fetch Article comments Failed",
  props<{ error: any }>()
)

export const getCommentBy = createAction(
  "[Board-detail page] get comment by no",
  props<{no: any}>()
)
export const setComment = createAction(
  "[Board-detail page] set temp state",
  props<{ comment: Comment}>()
)

export const createComment = createAction(
  "[Board-detail page] create new comment",
  props<{ comment: Comment }>()
)

export const createCommentSuccess = createAction(
  "[Board-detail page] create new comment",
  props<{ comment: Comment }>()
)

export const createCommentFailed = createAction(
  "[Board-detail page] create new comment",
  props<{ error: any }>()
)


/**
 *  board-edit edit
 */
export const setEditedArticle = createAction(
  "[Board-edit page] set Edited Article Form",
  props<{ detail: Article }>()
)

export const editArticle = createAction(
  "[Board-edit page] send Edited Article Form",
  props<{ detail: Article }>()
)

export const editSuccess = createAction(
  "[Board API] Fetch edited Article Success",
  props<{ detail: Article }>()
)

export const editFailed = createAction(
  "[Board API] Fetch edited Article Failed",
  props<{ error: any }>()
)

/**
 *  board-edit create
 */
export const createArticle = createAction(
  "[Board-edit page] send create Article Form",
  props<{ detail: Article }>()
)

export const createSuccess = createAction(
  "[Board API] Fetch create Article Success",
  props<{ detail: Article }>()
)

export const createFailed = createAction(
  "[Board API] Fetch create Article Failed",
  props<{ error: any }>()
)

/**
 *  board-edit delete
 */
export const deleteArticle = createAction(
  "[Board-edit page] send delete Article",
  props<{ articleNo: any }>()
)

export const deleteSuccess = createAction(
  "[Board API] Fetch delete Article Success",
  props<{ detail: Article }>()
)

export const deleteFailed = createAction(
  "[Board API] Fetch delete Article Failed",
  props<{ error: any }>()
)

