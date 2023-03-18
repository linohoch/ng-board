import {createAction, props} from "@ngrx/store";
import {Article} from "../../data";

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
  props<{ no: number }>()
)

export const getDetailSuccess = createAction(
  "[Board API] Fetch Article Success",
  props<{ detail: Article }>()
)

export const getDetailFailed = createAction(
  "[Board API] Fetch Article Failed",
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
  props<{ detail: Article }>()
)

export const deleteSuccess = createAction(
  "[Board API] Fetch delete Article Success",
  props<{ detail: Article }>()
)

export const deleteFailed = createAction(
  "[Board API] Fetch delete Article Failed",
  props<{ error: any }>()
)

