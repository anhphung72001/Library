import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusCircleOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { onValue, push, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../../firebase";
import "./styles.scss";

const UserManager = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listData, setListData] = useState();

  const columns = [
    {
      title: "order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 60,
    },
    {
      title: "User Code",
      dataIndex: "user_code",
      key: "user_code",
    },
    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "UID",
      dataIndex: "UID",
      key: "UID",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (val) =>
        val !== 0 ? (
          <div style={{ color: "red" }}>Inactive</div>
        ) : (
          <div style={{ color: "green" }}>Active</div>
        ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      render: (val, record) => (
        <Space size={8}>
          <Tooltip title="Edit User" mouseLeaveDelay={0}>
            <Button
              type="dashed"
              shape="circle"
              style={{ color: "#389e0d", borderColor: "#389e0d" }}
              icon={<EditOutlined />}
              size={32}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User" mouseLeaveDelay={0}>
            <Button
              type="dashed"
              shape="circle"
              danger
              style={{ color: "#cf1322" }}
              icon={<DeleteOutlined />}
              size={32}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
          {record.status === 0 ? (
            <Tooltip title="Lock User" mouseLeaveDelay={0}>
              <Button
                type="dashed"
                shape="circle"
                style={{ color: "#fa541c", borderColor: "#fa541c" }}
                icon={<LockOutlined />}
                size={32}
                onClick={() => changeStatus(record)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unlock User" mouseLeaveDelay={0}>
              <Button
                type="dashed"
                shape="circle"
                style={{ color: "#1677ff", borderColor: "#1677ff" }}
                icon={<UnlockOutlined />}
                size={32}
                onClick={() => changeStatus(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const changeStatus = (record) => {
    Modal.confirm({
      title: `Are you sure to ${
        record.status === 0 ? "Lock" : "Unlock"
      } this user?`,
      icon: record.status === 0 ? <LockOutlined /> : <UnlockOutlined />,
      content: `User Code: ${record.user_code}`,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        const tableRef = ref(database, `users/${record.id}`);
        update(tableRef, {
          status: record.status === 0 ? 1 : 0,
        });
        toast.success("Update status success.");
      },
      onCancel() {},
    });
  };
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Are you sure to Delete this user?",
      icon: <DeleteOutlined />,
      content: `User Code: ${record.user_code}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Xóa người dùng bằng hàm remove()
        const tableRef = ref(database, `users/${record.id}`);
        remove(tableRef);
        toast.success("Delete user information success.");
      },
      onCancel() {},
    });
  };

  const handleOpenModal = (record) => {
    if (record) {
      setOpenModal({
        ...record,
        isUpdate: true,
      });
      form.setFieldsValue({
        ...record,
      });
    } else {
      setOpenModal(true);
      form.resetFields();
    }
  };

  const handleSave = async () => {
    const data = await form.validateFields();
    setLoading(true);
    if (openModal.isUpdate) {
      // Cập nhật thông tin user
      const tableRef = ref(database, `users/${openModal.id}`);
      update(tableRef, data);
      toast.success("Update user information success.");
      setLoading(false);
      setOpenModal(false);
    } else {
      // Thêm thông tin user mới
      const tableRef = ref(database, "users");
      push(tableRef, {
        ...data,
        status: 0,
      });
      toast.success("Add user information success.");
      setLoading(false);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    //Lấy ra danh sách user
    const tableRef = ref(database, "users");
    setLoading(true);
    const unsubscribe = onValue(tableRef, (snapshot) => {
      const respData = snapshot.val();
      const dataList = respData
        ? Object.keys(respData).map((key, idx) => ({
            id: key,
            ...respData[key],
            order: idx + 1,
          }))
        : [];
      setListData(dataList);
      setLoading(false);
    });
    // Hủy theo dõi khi component bị unmount
    return () => unsubscribe(); // Dừng theo dõi khi component unmount
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page">User Manager</div>
        <Space size={8} className="mb-16">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add User
          </Button>
        </Space>
        <Table
          dataSource={listData}
          columns={columns}
          pagination={false}
          rowKey={"id"}
        />

        <Modal
          title={openModal.isUpdate ? "Update User" : "Add User"}
          open={openModal}
          onOk={handleSave}
          onCancel={() => setOpenModal(false)}
        >
          <Form
            form={form}
            name="user-manager"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="User Name"
              name="user_name"
              rules={[
                {
                  required: true,
                  message: "Please input your user name!",
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              label="User Code"
              name="user_code"
              rules={[
                {
                  required: true,
                  message: "Please input your user code!",
                },
              ]}
            >
              <Input placeholder="Enter code" />
            </Form.Item>
            <Form.Item
              label="UID"
              name="UID"
              rules={[
                {
                  required: true,
                  message: "Please input your UID!",
                },
              ]}
            >
              <Input placeholder="Enter UID" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Enter email!",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            {openModal.isUpdate && (
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select>
                  <Select.Option value={0}>Active</Select.Option>
                  <Select.Option value={1}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default UserManager;
