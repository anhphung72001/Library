import {
  CheckCircleOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
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
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../../firebase";

const BorrowsManager = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [dataTable, setListDataTable] = useState([]);
  const [conditions, setConditions] = useState({
    status: "",
    searchUser: "",
    searchBook: "",
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
      title: "Borrower Code",
      dataIndex: "user_code",
      key: "user_code",
      width: 140,
    },
    {
      title: "Borrower Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Book title",
      dataIndex: "book_title",
      key: "book_title",
      render: (val, record) => (
        <Tooltip title={val} mouseLeaveDelay={0}>
          <div className="max-line2">{val}</div>
        </Tooltip>
      ),
    },
    {
      title: "Borrow date",
      dataIndex: "borrow_date",
      key: "borrow_date",
      width: 180,
    },
    {
      title: "Due date",
      dataIndex: "due_date",
      key: "due_date",
      width: 130,
    },
    {
      title: "Borrow status",
      dataIndex: "borrow_status",
      key: "borrow_status",
      width: 130,
      align: "center",
      render: (val) =>
        val === 0 ? (
          <div style={{ color: "#fa541c" }}>Borrowed</div>
        ) : (
          <div style={{ color: "green" }}>Returned</div>
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
          {record.borrow_status === 0 ? (
            <Tooltip title="Returned" mouseLeaveDelay={0}>
              <Button
                type="dashed"
                shape="circle"
                style={{ color: "green", borderColor: "green" }}
                icon={<CheckCircleOutlined />}
                size={32}
                onClick={() => changeStatus(record)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Redo status" mouseLeaveDelay={0}>
              <Button
                type="dashed"
                shape="circle"
                style={{ color: "#fa541c", borderColor: "#fa541c" }}
                icon={<UndoOutlined />}
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
      title: `${
        record.borrow_status === 0
          ? "Confirm that user returned book?"
          : "Redo status to borrowed?"
      }`,
      icon:
        record.borrow_status === 0 ? <CheckCircleOutlined /> : <UndoOutlined />,
      // content: `Borrow Code: ${record.user_code}`,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        const tableRef = ref(database, `borrows/${record.id}`);
        update(tableRef, {
          borrow_status: record.borrow_status === 0 ? 1 : 0,
        });
        toast.success("Update status success.");
      },
      onCancel() {},
    });
  };

  const handleFilter = async () => {
    try {
      const data = await form.validateFields();
      setConditions((pre) => ({ ...pre, ...data }));
      setPagination((pre) => ({ ...pre, currentPage: 1 }));
    } finally {
    }
  };

  const sortData = (list) => {
    return list.sort((a, b) => {
      const dateA = new Date(a.borrow_date);
      const dateB = new Date(b.borrow_date);
      return dateB - dateA;
    });
  };
  useEffect(() => {
    form.setFieldsValue(conditions);
    //Lấy ra danh sách book
    const tableRef = ref(database, "borrows");
    setLoading(true);
    const unsubscribe = onValue(tableRef, (snapshot) => {
      const respData = snapshot.val();
      const dataList = respData
        ? Object.keys(respData).map((key, idx) => ({
            id: key,
            ...respData[key],
          }))
        : [];
      setListData(sortData(dataList));
      setLoading(false);
    });
    return () => unsubscribe(); // Dừng theo dõi khi giao diện được tải lên
  }, []);
  useEffect(() => {
    if (!listData?.length) return setListDataTable([]);
    const dataFilter = listData.filter(
      (i) =>
        (i.user_code
          ?.toLowerCase()
          ?.includes(conditions?.searchUser?.toLowerCase()) ||
          i.user_name
            ?.toLowerCase()
            ?.includes(conditions?.searchUser?.toLowerCase())) &&
        i.book_title
          ?.toLowerCase()
          ?.includes(conditions?.searchBook?.toLowerCase()) &&
        (conditions.status === ""
          ? true
          : i.borrow_status === +conditions.status)
    );
    setListDataTable(sortData(dataFilter));
  }, [conditions, listData]);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page">Borrows Manager</div>
        <Form layout="horizontal" form={form} defaultValue={conditions}>
          <Row gutter={12}>
            <Col span={7}>
              <Form.Item label="Book title" name="searchBook">
                <Input placeholder="Enter book title..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="User name/code" name="searchUser">
                <Input placeholder="Enter user name or user code..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Borrow status" name="status">
                <Select placeholder="Select Status">
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value="0">Borrowed</Select.Option>
                  <Select.Option value="1">Returned</Select.Option>
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
          rowKey={"id"}
        />
      </Spin>
    </div>
  );
};

export default BorrowsManager;
