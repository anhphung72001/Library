import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {},
};

export const appGlobalSlice = createSlice({
  name: "appGlobal",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    resetState: (state) => {
      return initialState;
    },
  },
});

export const { setUserInfo, resetState } = appGlobalSlice.actions;

export default appGlobalSlice.reducer;
