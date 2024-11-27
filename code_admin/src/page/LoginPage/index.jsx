import { Button, Form, Input } from "antd";
import { child, get, ref } from "firebase/database";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { toast } from "react-toastify";
import STORAGE, { setStorage } from "../../lib/storage";
import { setUserInfo } from "../../redux/appGlobal";
import { ROUTER } from "../../router/router";
import "./styles.scss";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "accounts"));
      if (snapshot.exists()) {
        const accounts = snapshot.val();
        const user = Object.values(accounts).find(
          (acc) => acc.user_name === values.username
        );
        if (user) {
          if (user.password === values.password) {
            setStorage(STORAGE.USER_INFO, user);
            dispatch(setUserInfo(user));
            navigate(ROUTER.USER_MANAGER);
            toast.success("Login success.");
          } else {
            toast.warning("Password is not correct!");
          }
        } else {
          toast.warning("Username is not available!");
        }
      } else {
        toast.warning("Account not found!");
      }
    } catch (err) {
      toast.error("An error occurred, please try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="wrap-page-login">
      <div className="wrap-login-form">
        <div className="text-center mb-40">
          <div className="fs-22 fw-600 title-popup">LOGIN PAGE</div>
        </div>
        <div>
          <Form form={form} layout="vertical">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input username!",
                },
              ]}
              name="username"
              label="User name"
            >
              <Input placeholder="input name..." />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input password!",
                },
              ]}
              name="password"
              label="Password"
            >
              <Input.Password placeholder="input password..." />
            </Form.Item>
            <Button
              loading={loading}
              // btnType="orange-third"
              className="btn-login mt-16"
              type="submit"
              htmlType="submit"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
