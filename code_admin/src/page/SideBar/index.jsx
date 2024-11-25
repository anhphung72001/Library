import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  ContactsOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const items = [
  {
    key: "/user-manager",
    icon: <UserOutlined />,
    label: "User Manager",
  },
  {
    key: "/account-manager",
    icon: <ContactsOutlined />,
    label: "Account Manager",
  },
  {
    key: "/book-manager",
    icon: <BookOutlined />,
    label: "Book Manager",
  },
  {
    key: "/borrows-manager",
    icon: <UserSwitchOutlined />,
    label: "Borrows Manager",
  },
];

function SideBar({ children }) {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState([]);
  const onClick = (e) => {
    navigate(e.key);
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
