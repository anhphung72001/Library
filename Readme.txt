Thư mục code_admin: Chứa code cho phần quản lý.
Thư mục code_user: Chứa code cho phần giao diện hiển thị trên kiosk.
Cả 2 thư mục trên đều chứa các thư mục giống nhau như:
- build: chứa code sau khi build.
- src: thư mục chứ code chính. Trong thư mục src có các file như:
	+ assets: thư mục chứa các phần dùng trong cho hệ thống(ảnh, css).
	+ constant: chứa các biến được khai báo để dùng chung trong hệ thống.
	+ page: chứa code của các trang, màn hình trong hệ thống.
	+ store: chứa hàm cấu hình để lưu dữ liệu vào hệ thống.
- node_modules: thư mục chứ thư viện dùng trong hệ thống.
- File firebase.js cấu hình firebase cho hệ thống.
- File package.js chứa thông tin thư viện sử dụng trong hệ thống

Để chạy code cần bật Terminal của VSC, tiếp theo cd đúng thư mục muốn chạy
VD: D:\code_user>
Tiếp theo chạy lệnh "npm i" để tải thư viện, sau đó là lệnh "npm start" để chạy dự án.

Ngoài ra, còn các thư mục như .firebase, build và các file khác là cấu hình firebase hosting.


