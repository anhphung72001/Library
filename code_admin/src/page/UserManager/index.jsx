import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
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
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { onValue, push, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../../firebase";
import "./styles.scss";

const UserManager = () => {
  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listData, setListData] = useState();
  const [dataTable, setListDataTable] = useState([]);
  const [conditions, setConditions] = useState({
    status: "",
    textSearch: "",
  });
  const [pagination, setPagination] = useState({
    pageSize: 20,
    currentPage: 1,
  });

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 60,
      render: (val, record, idx) => {
        return (
          <div className="text-center">
            {idx + 1 + pagination.pageSize * (pagination.currentPage - 1)}
          </div>
        );
      },
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
    try {
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
        if (listData?.find((i) => i.user_code === data.user_code)) {
          return toast.warning("User code already exists!");
        }
        push(tableRef, {
          ...data,
          status: 0,
        });
        toast.success("Add user information success.");
        setLoading(false);
        setOpenModal(false);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleFilter = async () => {
    try {
      const data = await formFilter.validateFields();
      setConditions((pre) => ({ ...pre, ...data }));
      setPagination((pre) => ({ ...pre, currentPage: 1 }));
    } finally {
    }
  };

  useEffect(() => {
    formFilter.setFieldsValue(conditions);
    //Lấy ra danh sách user
    const tableRef = ref(database, "users");
    setLoading(true);
    const unsubscribe = onValue(tableRef, (snapshot) => {
      const respData = snapshot.val();
      const dataList = respData
        ? Object.keys(respData).map((key, idx) => ({
            id: key,
            ...respData[key],
          }))
        : [];
      setListData(dataList);
      setLoading(false);
    });
    // Hủy theo dõi khi component bị unmount
    return () => unsubscribe(); // Dừng theo dõi khi component unmount
  }, []);
  useEffect(() => {
    if (!listData?.length) return setListDataTable([]);
    console.log("conditions: ", conditions);
    const dataFilter = listData.filter(
      (i) =>
        (i.user_code
          ?.toLowerCase()
          ?.includes(conditions?.textSearch?.toLowerCase()) ||
          i.user_name
            ?.toLowerCase()
            .includes(conditions?.textSearch?.toLowerCase())) &&
        (conditions.status === "" ? true : i.status === +conditions.status)
    );
    setListDataTable(dataFilter);
  }, [conditions, listData]);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page d-flex justify-content-space-between">
          User Manager{" "}
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add User
          </Button>
        </div>
        <Form layout="horizontal" form={formFilter} defaultValue={conditions}>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item label="User name/code" name="textSearch">
                <Input
                  placeholder="Enter user name or user code..."
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select Status">
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value="0">Active</Select.Option>
                  <Select.Option value="1">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="w-100"
                onClick={handleFilter}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          dataSource={dataTable}
          columns={columns}
          rowKey={"id"}
          pagination={{
            hideOnSinglePage: dataTable?.length <= 20,
            current: pagination?.currentPage,
            pageSize: pagination?.pageSize,
            total: dataTable?.length,
            showSizeChanger: dataTable?.length > 20,
            showTotal: (total) => (
              <div>
                Total: <b>{total}</b>
              </div>
            ),
            onChange: (page, pageSize) => {
              let currentPage = page;
              if (pageSize !== pagination.pageSize) {
                currentPage = 1;
              }
              setPagination({
                ...pagination,
                currentPage: currentPage,
                pageSize: pageSize,
              });
            },
          }}
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
