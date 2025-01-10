import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/UserDetailSlice"; // Import the reducer directly

const store = configureStore({
  reducer: {
    userDetail: userReducer, // Use the reducer here
  },
});
console.log("store-",store);

export default store;
export type RootStateType = ReturnType<typeof store.getState>;