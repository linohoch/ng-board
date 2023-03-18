import { UserState } from "./user";
import { BoardState } from "./board";


export interface State {
  users : UserState;
  board : BoardState;
}
