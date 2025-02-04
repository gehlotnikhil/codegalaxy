import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface parcticeDetailType{
  solvedProblemDetails: string[],
  participated: boolean,
  review: number
}
interface praticeCourseDetailType {
  c:parcticeDetailType,
  cpp:parcticeDetailType,
  java:parcticeDetailType,
  go:parcticeDetailType,
}
type UserDetailType = {
  id: string;
  name: string;
  age: number;
  gender: string;
  userName: string;
  email: string;
  collegeName: string;
  linkedin_url: string;
  contestDetails: any[];
  country: string;
  googleLoginAccess: boolean;
  noOfContestParticipated: number;
  noOfProblemSolved: number;
  isAdmin: boolean;
  solvedProblemDetails: any[];
  state: string;
  totalRank: number;
  token: null | string;
  profilePictureUrl: string;
  password: string;
  activeDays:number[];
  praticeCourseDetail: praticeCourseDetailType
};



const initialUserDetail: UserDetailType = {
  id: '',
  name: '',
  age: 0,
  gender: '',
  userName: '',
  email: '',
  linkedin_url: '',
  collegeName: '',
  contestDetails: [],
  country: '',
  googleLoginAccess: false,
  noOfContestParticipated: 0,
  noOfProblemSolved: 0,
  isAdmin:false,
  solvedProblemDetails: [],
  state: '',
  totalRank: 0,
  token: null,
  profilePictureUrl: '',
  password: '',
  activeDays:[],
  praticeCourseDetail: {
    c: {
      solvedProblemDetails: [],
      participated:false,
      review:0
    },
    cpp: {
      solvedProblemDetails: [],
      participated:false,
      review:0
    },
    java: {
      solvedProblemDetails: [],
      participated:false,
      review:0
    },
    go: {
      solvedProblemDetails: [],
      participated:false,
      review:0
    },
  }
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