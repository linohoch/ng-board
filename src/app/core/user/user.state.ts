import {Article} from "../../data";

export interface User {
  no: number,
  email: string,
  pw: String
  pwLastChange: Date
  articles: Article[]
  // shop:         Shop[]
  comment: Comment[]
  createdAt: Date
  firstName: String
  lastName: String
  provider: String
  token?: String
  roles: String[]
}
export interface Google {
  iss: string,
  aud: string,
  sub: string,
  email: string,
  given_name: string,
  family_name: string,
  nbf: string,
  email_verified: boolean,
  azp: string,
  name: string,
  picture: string,
  iat: string,
  exp: string,
  jti: string,
}

export interface UserState {
  user: User | null
  tempUser: Google | null
}
export const initialState: UserState = {
  user: null,
  tempUser: null
}
