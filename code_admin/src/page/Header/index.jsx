import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import "./styles.scss";

const Header = () => {
  const { userInfo } = useSelector((state) => state.appGlobal);
  return (
    <div className="header-app justify-content-space-between">
      <div className="h-100 d-flex align-items-center">
        <img src={logo} alt="Logo" height={"80%"} />
        <div className="header-title">Education Library</div>
      </div>
      {userInfo?.user_name && (
        <div className="d-flex align-items-center">
          <Avatar size={40} icon={<UserOutlined />} />
          <div className="ml-8 mr-16" style={{ color: "#fff" }}>
            <div className="fs-16 fw-600">{userInfo?.user_name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
