**Topic 11: Introduction to Information Security Project**
Hệ thống quản lý chuỗi cung ứng thuốc bằng Blockchain. Đảm bảo tính minh bạch và chống hàng giả thông qua Smart Contract.

**Prerequisites** 
Ganache UI: Chạy mạng Blockchain cục bộ.

MetaMask Extension: Ví điện tử trên trình duyệt.

Remix IDE: Để biên dịch và Deploy Contract.

VS Code: Chạy Live Server cho giao diện Web.

**Setup Instructions (Hướng dẫn cài đặt)**
1. Khởi tạo Blockchain & Ví
Mở Ganache, chọn "New Workspace".

Thêm mạng Ganache vào MetaMask (RPC: http://127.0.0.1:9545, Chain ID: 1337).

Import Private Keys của ít nhất 4 ví từ Ganache vào MetaMask (Đặt tên: Admin, Nhà Sản Xuất, Phân Phối, Nhà Thuốc).

2. Deploy Smart Contract
Mở Remix IDE, dán code SupplyChain.sol.

Tại tab "Deploy", chọn Environment là Custom - External Http Provide or Browser Extension (Metamask)

Nhấn Deploy. Sau khi thành công, tìm mục Deployed Contracts và bấm icon Copy Address để lấy địa chỉ Contract.

3. Kết nối Giao diện Web
Chạy giao diện Web bằng Live Server.

Đăng nhập với vai trò bất kỳ (ví dụ: Manufacturer).

Tìm và nhấn vào nút Contract Setting trên giao diện.

Dán địa chỉ Contract vừa copy từ Remix vào ô Address.

Nhấn Connect để kích hoạt kết nối giữa Web3 và Smart Contract.

*Demo Scenario*
Bước 1: Thiết lập quyền (Admin)
Trên Remix (hoặc Web nếu có tính năng Admin), dùng ví Admin gọi hàm registerActor() để cấp quyền cho các ví tương ứng (Manufacturer, Distributor, Pharmacy).

Bước 2: Tạo thuốc (Manufacturer)
Đăng nhập ví Nhà Sản Xuất trên MetaMask.

Vào mục Add Medicine, nhập thông tin lô thuốc (ID: 3001) và nhấn xác nhận trên MetaMask.

Bước 3: Luân chuyển (Transfer)
Manufacturer chuyển cho Distributor.

Chuyển ví MetaMask sang Distributor, thực hiện chuyển tiếp cho Pharmacy.

Bước 4: Kiểm chứng (Verify)
Vào tab Verify & View History, nhập ID 3001 để xem toàn bộ lịch sử luân chuyển minh bạch trên Blockchain.