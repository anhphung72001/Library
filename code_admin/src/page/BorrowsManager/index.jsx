import {
  CheckCircleOutlined,
  UndoOutlined
} from "@ant-design/icons";
import { Button, Modal, Select, Space, Spin, Table, Tooltip } from "antd";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../../firebase";

const BorrowsManager = () => {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('')

  const columns = [
    {
      title: "order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 60,
    },
    {
      title: "Borrower Code",
      dataIndex: "user_code",
      key: "user_code",
      width: 140,
      render: (val, record) => record?.user?.user_code,
    },
    {
      title: "Borrower Name",
      dataIndex: "user_name",
      key: "user_name",
      render: (val, record) => record?.user?.user_name,
    },
    {
      title: "Book title",
      dataIndex: "user_name",
      key: "user_name",
      render: (val, record) => (
        <Tooltip title={record?.book?.title} mouseLeaveDelay={0}>
          <div className="max-line2">{record?.book?.title}</div>
        </Tooltip>
      ),
    },
    {
      title: "Borrow date",
      dataIndex: "borrow_date",
      key: "borrow_date",
      width: 120,
    },
    {
      title: "Due date",
      dataIndex: "due_date",
      key: "due_date",
      width: 120,
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

  const filterListData = () => {
    if(statusFilter !== '') return listData.filter(i => i.borrow_status === statusFilter) 
    else return listData
  }

  useEffect(() => {
    const borrowsRef = ref(database, "borrows");
    setLoading(true);
    // Lấy danh sách borrows
    const unsubscribe = onValue(borrowsRef, (snapshot) => {
      const borrowsData = snapshot.val();
      if (borrowsData) {
        const borrowList = Object.keys(borrowsData).map((key, idx) => ({
          id: key,
          ...borrowsData[key],
          order: idx + 1,
        }));
        // Sau khi lấy borrows, truy xuất thêm users và books
        borrowList.forEach((borrow) => {
          const userRef = ref(database, `users/${borrow.user_id}`);
          const bookRef = ref(database, `books/${borrow.book_id}`);

          onValue(userRef, (userSnapshot) => {
            borrow.user = userSnapshot.val();
            setListData((prevBorrows) => [...prevBorrows]); // Cập nhật trạng thái sau khi lấy user
          });

          onValue(bookRef, (bookSnapshot) => {
            borrow.book = bookSnapshot.val();
            setListData((prevBorrows) => [...prevBorrows]); // Cập nhật trạng thái sau khi lấy book
          });
        });
        setListData(borrowList);
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Dừng theo dõi khi giao diện được tải lên hoàn tất
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page">Borrows Manager</div>
        <div className="d-flex align-items-center">
          <div className="fw-600 mr-8">Borrow Status:</div>
          <Select placeholder="Select Status" value={statusFilter} onChange={status => setStatusFilter(status)} style={{width: 300}}>
          <Select.Option value="">All</Select.Option>
          <Select.Option value="0">Borrowed</Select.Option>
          <Select.Option value="1">Returned</Select.Option>
        </Select>
        </div>
        <Table
          dataSource={statusFilter !== '' ? listData.filter(i => i.borrow_status === +statusFilter) : listData}
          columns={columns}
          pagination={false}
          rowKey={"id"}
        />
      </Spin>
    </div>
  );
};

export default BorrowsManager;
