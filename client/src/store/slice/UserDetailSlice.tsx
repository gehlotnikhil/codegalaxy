import { createSlice } from "@reduxjs/toolkit";

// type User = {
//   name?: string;
// };

const UserDetailSlice = createSlice({
  name: "user",
  initialState: [] as string[], // Correctly define the initial state as an array of users
  reducers: {
    addUser(state:any, action: any) {
      // Add a new user to the state
      (state).push(action.payload) ;
    },
    removeUser(state:any, action:any) {
      state
      action
      console.log("delete");

      state.splice(action.payload,1)
    },
    deleteUsers(state:any, action:any) {
      state
      action
      return []
    },
  },
});
console.log("UserDetailSlice-",UserDetailSlice);

// Export the slice's actions and reducer
export const { addUser, removeUser, deleteUsers } = UserDetailSlice.actions;  
export default UserDetailSlice.reducer;