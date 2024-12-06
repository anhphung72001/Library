import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Space,
  Spin,
  Table,
  Tooltip,
  Upload,
} from "antd";
import { onValue, push, ref, remove, update } from "firebase/database";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../../firebase";
import uploadFile from "../../uploadFile";

const BookManager = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listData, setListData] = useState();
  const [fileUpload, setFileUpload] = useState([]);

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 60,
    },
    {
      title: "Book Image",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (val) => <Image src={val} alt="Image" />,
    },
    {
      title: "Book Title",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: "Book Author",
    //   dataIndex: "author",
    //   key: "author",
    // },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
    },
    {
      title: "Add Date",
      dataIndex: "date_added",
      key: "date_added",
      width: 120,
      render: (val) => moment(val).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      render: (val, record) => (
        <Space size={8}>
          <Tooltip title="Edit Book" mouseLeaveDelay={0}>
            <Button
              type="dashed"
              shape="circle"
              style={{ color: "#389e0d", borderColor: "#389e0d" }}
              icon={<EditOutlined />}
              size={32}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Book" mouseLeaveDelay={0}>
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
        </Space>
      ),
    },
  ];

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Are you sure to Delete this book?",
      icon: <DeleteOutlined />,
      content: `Book Title: ${record.title}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Xóa người dùng bằng hàm remove()
        const tableRef = ref(database, `books/${record.id}`);
        remove(tableRef);
        toast.success("Delete book information success.");
      },
      onCancel() {},
    });
  };

  const handleOpenModal = (record) => {
    form.resetFields()
    setFileUpload([]);
    if (record) {
      setOpenModal({
        ...record,
        isUpdate: true,
      });
      form.setFieldsValue({
        ...record,
        file: record.image
          ? [
              {
                url: record.image,
              },
            ]
          : [],
      });
    } else {
      setOpenModal(true);
    }
  };

  const handleSave = async () => {
    const data = await form.validateFields();
    setLoading(true);
    if (openModal.isUpdate) {
      // Cập nhật thông tin book
      let image = "";
      if (fileUpload[0]?.originFileObj) {
        image = await uploadFile(fileUpload[0].originFileObj);
      } else {
        image = data.file[0]?.url || "";
      }
      const tableRef = ref(database, `books/${openModal.id}`);
      update(tableRef, {
        title: data.title,
        // author: data.author,
        quantity: data.quantity,
        image,
      });
      toast.success("Update book information success.");
      setLoading(false);
      setOpenModal(false);
    } else {
      // Thêm thông tin book mới
      const tableRef = ref(database, "books");
      const date_added = moment().format("YYYY-MM-DD");
      let image = "";
      if (fileUpload[0]?.originFileObj) {
        image = await uploadFile(fileUpload[0].originFileObj);
      }
      push(tableRef, {
        title: data.title,
        // author: data.author,
        quantity: data.quantity,
        date_added,
        image,
      });
      toast.success("Add book information success.");
      setLoading(false);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    //Lấy ra danh sách book
    const tableRef = ref(database, "books");
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
    return () => unsubscribe(); // Dừng theo dõi khi giao diện được tải lên
  }, []);

  //xử lý khi chọn file
  const handleUploadFile = async ({ file, fileList }) => {
    setFileUpload(fileList);
  };

  return (
    <div>
      <Spin spinning={loading}>
        <div className="title-page d-flex justify-content-space-between">
          Book Manager{" "}
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add Book
          </Button>
        </div>
        <Table
          dataSource={listData}
          columns={columns}
          pagination={false}
          rowKey={"id"}
        />

        <Modal
          title={openModal.isUpdate ? "Update Book" : "Add Book"}
          open={openModal}
          onOk={handleSave}
          onCancel={() => setOpenModal(false)}
        >
          <Spin spinning={loading}>
            <Form
              form={form}
              name="book-manager"
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Book Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input book title!",
                  },
                ]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              {/* <Form.Item
              label="Book Author"
              name="author"
              rules={[
                {
                  required: true,
                  message: "Please input author!",
                },
              ]}
            >
              <Input placeholder="Enter author" />
            </Form.Item> */}
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please input quantity!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Enter quantity"
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Image"
                name="file"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!!value?.find((i) => i?.size > 5 * 1024 * 1024)) {
                        return Promise.reject(
                          new Error("Dung lượng file tối đa 5MB")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Upload
                  accept="image/*"
                  multiple={false}
                  maxCount={1}
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={fileUpload}
                  onChange={handleUploadFile}
                >
                  <button
                    style={{
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </button>
                </Upload>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Spin>
    </div>
  );
};

export default BookManager;
