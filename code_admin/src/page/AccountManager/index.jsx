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

const AccountManager = () => {
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
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
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
          <Tooltip title="Edit Account" mouseLeaveDelay={0}>
            <Button
              type="dashed"
              shape="circle"
              style={{ color: "#389e0d", borderColor: "#389e0d" }}
              icon={<EditOutlined />}
              size={32}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Account" mouseLeaveDelay={0}>
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
            <Tooltip title="Lock Account" mouseLeaveDelay={0}>
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
            <Tooltip title="Unlock Account" mouseLeaveDelay={0}>
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
      } this account?`,
      icon: record.status === 0 ? <LockOutlined /> : <UnlockOutlined />,
      content: `Email: ${record.email}`,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        const tableRef = ref(database, `accounts/${record.id}`);
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
      title: "Are you sure to Delete this account?",
      icon: <DeleteOutlined />,
      content: `Email: ${record.email}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Xóa người dùng bằng hàm remove()
        const tableRef = ref(database, `accounts/${record.id}`);
        remove(tableRef);
        toast.success("Delete account information success.");
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
    if(listData.find(i => i.email === data.email)) return toast.warning("Email already in use!");
    setLoading(true);
    if (openModal.isUpdate) {
      // Cập nhật thông tin account
      const tableRef = ref(database, `accounts/${openModal.id}`);
      update(tableRef, data);
      toast.success("Update account information success.");
      setLoading(false);
      setOpenModal(false);
    } else {
      // Thêm thông tin account mới
      const tableRef = ref(database, "accounts");
      push(tableRef, {
        ...data,
        status: 0,
      });
      toast.success("Add account information success.");
      setLoading(false);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    //Lấy ra danh sách account
    const tableRef = ref(database, "accounts");
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
    return () => unsubscribe(); // Dừng theo dõi khi component unmount
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page">Account Manager</div>
        <Space size={8} className="mb-16">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add Account
          </Button>
        </Space>
        <Table
          dataSource={listData}
          columns={columns}
          pagination={false}
          rowKey={"id"}
        />

        <Modal
          title={openModal.isUpdate ? "Update Account" : "Add Account"}
          open={openModal}
          onOk={handleSave}
          onCancel={() => setOpenModal(false)}
        >
          <Form
            form={form}
            name="account-manager"
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
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="input password" />
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

export default AccountManager;
