import {createAction, props} from "@ngrx/store";
import {Article, Comment} from "./board.state";

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
  props<{ no: any, isRead?: boolean }>()
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
  "[Board-detail page] get comments",
  props<{ no: any }>()
)
export const getCommentsSuccess = createAction(
  "[Board API] Fetch comments Success",
  props<{ commentList: Comment[] }>()
)
export const getCommentsFailed = createAction(
  "[Board API] Fetch comments Failed",
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
  "[Board API] create new comment",
  props<{ comment: Comment }>()
)

export const createCommentFailed = createAction(
  "[Board API] create new comment",
  props<{ error: any }>()
)
// export const likeArticle = createAction(
//   "[Board-detail page] like article",
//   props<{ no: any }>()
// )
// export const likeArticleSuccess = createAction(
//   "[Board API] like article success",
//   props<{ no: any }>()
// )
// export const likeArticleFailed = createAction(
//   "[Board API] like article failed",
//   props<{ error: any }>()
// )



/**
 *  board-edit edit
 */
export const setEditedArticle = createAction(
  "[Board-edit page] set Edited Article Form",
  props<{ temp: any }>()
)

export const editArticle = createAction(
  "[Board-edit page] send Edited Article Form",
  props<{ detail: any }>()
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
 *  board-create
 */
export const setArticle = createAction(
  "[Board-create page] send create Article Form",
  props<{ detail: any }>()
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
 *  board-detail delete
 */
export const deleteArticle = createAction(
  "[Board-detail page] send delete Article",
  props<{ articleNo: any, userEmail?: any }>()
)

export const deleteSuccess = createAction(
  "[Board API] Fetch delete Article Success",
)

export const deleteFailed = createAction(
  "[Board API] Fetch delete Article Failed",
  props<{ error: any }>()
)


/**
 *
 * edit-page 입장처리
 */
export const getPermissionToEdit = createAction(
  "[Board-edit page] access to edit page",
  props<{ detail:Article, me: string, pw?: string }>()
)
export const matchSuccess = createAction(
  "[Board-edit page] set permission",
)
export const matchFailed = createAction(
  "[Board-edit page] remove permission",
)
