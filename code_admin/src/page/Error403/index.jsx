import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";
import STORAGE, { getStorage } from "../../lib/storage";
import { ROUTER } from "../../router/router";

function Error403() {
  return (
    <Result
      status="403"
      title="403 Not Authorized"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <NavLink to={getStorage(STORAGE.USER_INFO) ? "/" : ROUTER.LOGIN}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" className="btn-hover-shadow">
              Quay lại
            </Button>
          </div>
        </NavLink>
      }
    />
  );
}
export default Error403;
