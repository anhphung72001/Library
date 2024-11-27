import { configureStore } from "@reduxjs/toolkit";
import appGlobalReducer from "./appGlobal";

export default configureStore({
  reducer: {
    appGlobal: appGlobalReducer,
  },
});
