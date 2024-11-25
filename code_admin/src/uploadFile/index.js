import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";  // Import Firebase storage
import moment from "moment";

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }
    const id = moment().format('YYYYMMDDHHmmssSSS')
    const storageRef = ref(storage, `uploads/${id}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
      },
      (error) => {
        reject(error);  // Xử lý lỗi khi upload
      },
      () => {
        // download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);  // Trả về URL của file
          })
          .catch((error) => {
            reject(error);  // Xử lý lỗi khi lấy URL
          });
      }
    );
  });
};

export default uploadFile;
