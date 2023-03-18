import {Article} from "../../data";

export interface BoardState {
  isLoading: boolean
  error: string | null
  articles: Article[]
  detail: Article | null
  temp: Article |null
}
export const initialState: BoardState = {
  isLoading: false,
  error: null,
  articles: [],
  detail: null,
  temp: null
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
