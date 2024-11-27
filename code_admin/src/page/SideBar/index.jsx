import {
  BookOutlined,
  LogoutOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearStorage } from "../../lib/storage";
import { resetState } from "../../redux/appGlobal";
import { ROUTER } from "../../router/router";
import "./styles.scss";
import { toast } from "react-toastify";

const items = [
  {
    key: ROUTER.USER_MANAGER,
    icon: <UserOutlined />,
    label: "User Manager",
  },
  // {
  //   key: ROUTER.ACCOUNT_MANAGER,
  //   icon: <ContactsOutlined />,
  //   label: "Account Manager",
  // },
  {
    key: ROUTER.BOOK_MANAGER,
    icon: <BookOutlined />,
    label: "Book Manager",
  },
  {
    key: ROUTER.BORROWS_MANAGER,
    icon: <UserSwitchOutlined />,
    label: "Borrows Manager",
  },
  {
    key: ROUTER.LOGIN,
    icon: <LogoutOutlined style={{ color: "red" }} />,
    label: <div style={{ color: "red", fontSize: 16 }}>Logout</div>,
  },
];

function SideBar({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState([]);
  const onClick = (e) => {
    navigate(e.key);
    if (e.key === ROUTER.LOGIN) {
      dispatch(resetState());
      clearStorage();
      toast.success("Logout success.");
    }
  };
  useEffect(() => {
    setActiveKey([window.location.pathname]);
  }, [window.location.pathname]);

  return (
    <div className="d-flex align-items-flex-start wrap-section">
      <Menu
        onClick={onClick}
        className="menu-app"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        selectedKeys={activeKey}
        mode="inline"
        items={items}
      />
      <div className="wrap-page">{children}</div>
    </div>
  );
}

export default SideBar;
