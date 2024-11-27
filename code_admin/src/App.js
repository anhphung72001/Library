import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import AppRouter from "./router";
import { useDispatch } from "react-redux";
import STORAGE, { getStorage } from "./lib/storage";
import { setUserInfo } from "./redux/appGlobal";
import { ROUTER } from "./router/router";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const user = getStorage(STORAGE.USER_INFO);
    dispatch(setUserInfo(user || {}));
    if (!user) navigate(ROUTER.LOGIN);
  }, []);
  return <AppRouter />;
}

export default App;
