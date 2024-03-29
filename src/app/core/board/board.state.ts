export const OrderBy = {
  date:'date',
  like:'like'
} as const
export type OrderBy = typeof OrderBy[keyof typeof OrderBy]
export const Order = {
  desc:'desc',
  asc:'asc'
} as const
export type Order = typeof Order[keyof typeof Order]

export interface BoardState {
  isLoading: boolean
  isPermit: boolean
  error: string | null
  articles: Article[]
  detail: Article | null
  temp: Article | null
  comment: Comment | null
  commentList: Comment[] | null
  photos: Photo[]
  file: File | null
  page: number
  history: any[],
  sort: Sort
}
export const initialState: BoardState = {
  isLoading: false,
  isPermit: false,
  error: null,
  articles: [],
  detail: null,
  temp: null,
  comment: null,
  commentList: [],
  photos: [],
  file: null,
  page: 0,
  history: [],
  sort: { nextPage: 1, limit: 10, orderBy: OrderBy['date'], order: Order.desc}

}
export interface Sort {
  nextPage: number,
  limit: number,
  orderBy: OrderBy,
  order: Order
}

export interface Photo {
  no: number | null;
  articleNo: number | null;
  origin: string;
  upload: string;
  url: string;
  size: number;
  insDate: Date | null;
}

export class ArticleVO implements Article {
  shopNo: number = 0;
  no: number = 0;
  title: string = '';
  contents: string = '';
  userNo: number = 0;
  userEmail: string | null = null;
  hitCnt: number = 0;
  likeCnt: number = 0;
  likeYn: boolean | null = null;
  insDate: Date | null = null;
  upDate: Date | null = null;
  photo: string | null = null;
  isDelete: boolean = false;
  pw: string | null = null;
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
  likeYn: boolean | null;
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

