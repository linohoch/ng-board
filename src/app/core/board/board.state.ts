
export interface BoardState {
  isLoading: boolean
  isPermit: boolean
  error: string | null
  articles: Article[]
  detail: Article | null
  temp: Article | null
  comment: Comment | null
  commentList: Comment[] | null

}
export const initialState: BoardState = {
  isLoading: false,
  isPermit: false,
  error: null,
  articles: [],
  detail: null,
  temp: null,
  comment: null,
  commentList: []
}

export interface Article {
  shopNo: number | null;
  no: number;
  title: string;
  contents: string;
  userNo: number | null;
  userEmail: string | null;
  hitCnt: number | null;
  likeCnt: number | null;
  likeYn: number | null;
  insDate: Date | null;
  upDate: Date | null;
  photo: string | null;
  isDelete: boolean;
  pw: string | null;
}

export class rootComment implements Comment {
  no: number | null | undefined

  thread: number[] = []
  parent: number = 0
  grp: number = 0
  seq: number = 0
  lv: number = 0

  articleNo: number | undefined = 0;
  userEmail: string | undefined = '';
  contents: string | undefined = '';

  likeCnt: number | null = 0;
  insDate: Date | null | undefined
  upDate: Date | null | undefined
  isDelete: boolean = false
  likeYn: boolean = false
}

export interface Comment {
  no: number | null | undefined

  thread: number[] | null
  parent: number
  grp: number
  seq: number
  lv: number

  articleNo: number | undefined
  userEmail: string | undefined
  contents: string | undefined

  likeCnt: number | null
  insDate: Date | null | undefined
  upDate: Date | null | undefined
  isDelete: boolean
  likeYn: boolean
}
// export interface Board {
//   shopNo:number|null;
//   no:number;
//   title:string;
//   // contents:string;
//   userNo:number;
//   userEmail:string;
//   hitCnt:number;
//   likeCnt:number;
//   likeYn:number;
//   // upDate:string|null;
//   photo:string|null;
// }

