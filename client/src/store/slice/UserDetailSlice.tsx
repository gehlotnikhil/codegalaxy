import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoleType = {
  User:boolean;
  Admin:boolean;
}
type UserDetailType = {
  id: string;
  name: string;
  age: number;
  gender: string;
  userName: string;
  email: string;
  collegeName: string;
  contestDetails: any[];
  country: string;
  googleLoginAccess: boolean;
  noOfContestParticipated: number;
  noOfProblemSolved: number;
  role: RoleType;
  solvedProblemDetails: any[];
  state: string;
  totalRank: number;
  token: null | string;
  profilePictureUrl: string;
  password: string;
};


const initialUserDetail: UserDetailType = {
  id: '',
  name: '',
  age: 0,
  gender: '',
  userName: '',
  email: '',
  collegeName: '',
  contestDetails: [],
  country: '',
  googleLoginAccess: false,
  noOfContestParticipated: 0,
  noOfProblemSolved: 0,
  role: {
    User:true,
    Admin:false
  },
  solvedProblemDetails: [],
  state: '',
  totalRank: 0,
  token: null,
  profilePictureUrl: '',
  password: '',
};

const UserDetailSlice = createSlice({
  name: "userDetail",
  initialState: initialUserDetail,
  reducers: {
    setUserDetail(state, action: PayloadAction<any>) {
      console.log("setUserDetail");
      return { ...state, ...(action.payload) }; // Spread new data into the state
    },
    deleteUserDetail() {
      console.log("deleteUserDetail");
      return initialUserDetail; // Reset to initial state
    },
  },
});

console.log("UserDetailSlice-", UserDetailSlice);

// Export the slice's actions and reducer
export const { setUserDetail, deleteUserDetail } = UserDetailSlice.actions;
export default UserDetailSlice.reducer;
export type EntireUserDetailType = UserDetailType;