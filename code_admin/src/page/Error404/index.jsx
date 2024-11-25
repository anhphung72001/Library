import { Button, Result } from "antd"
import { NavLink } from "react-router-dom"

function Error404() {
  return (
    <Result
    status="404"
    title="404 NotFound"
    subTitle="Sorry, the page you visited does not exist."
    extra={<NavLink to="/">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" className="btn-hover-shadow">
            Quay lại trang chủ
          </Button>
        </div>
      </NavLink>}
  />
  )
}
export default Error404
