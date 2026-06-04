# Project II - Hệ thống đặt vé xem biểu diễn trực tuyến

## Phần 1. GIỚI THIỆU ĐỀ TÀI

### 1.1. Tổng quan đề tài

Hệ thống đặt vé xem biểu diễn trực tuyến được xây dựng nhằm hỗ trợ khách hàng đặt vé nhanh chóng, thuận tiện và giảm tải cho quy trình bán vé thủ công tại các trung tâm biểu diễn nghệ thuật. Hệ thống cho phép người dùng xem lịch diễn, chọn ghế, đặt vé và thanh toán trực tuyến hoặc thanh toán tiền mặt khi nhận vé.

### 1.2. Mục tiêu hệ thống

- Tin học hóa quy trình đặt vé biểu diễn nghệ thuật.
- Hỗ trợ khách hàng chọn ghế trực quan.
- Tích hợp thanh toán online và giao vé tận nơi.
- Quản lý trạng thái ghế theo thời gian thực.
- Hỗ trợ lập báo cáo doanh thu.

---

# Phần 2. PHÂN TÍCH HỆ THỐNG

## 2.1. Mô tả bài toán

Hệ thống phục vụ việc bán vé cho các chương trình biểu diễn nghệ thuật. Người dùng có thể:
- Xem danh sách chương trình.
- Chọn suất diễn.
- Chọn ghế.
- Thanh toán online hoặc tiền mặt.
- Nhận vé điện tử hoặc giao vé tận nơi.

## 2.2. Các tác nhân (Actors)

- Khách hàng
- Nhân viên giao vé
- Cổng thanh toán online
- Quản trị viên

## 2.3. Danh sách Use Case

| Mã UC | Tên Use Case |
|---|---|
| UC01 | Quản lý chương trình |
| UC02 | Xem suất diễn |
| UC03 | Đặt vé online |
| UC04 | Thanh toán online |
| UC05 | Giao vé tiền mặt |
| UC06 | Lập báo cáo doanh thu |

## 2.4. Đặc tả Use Case

### 2.4.1. UC “Đặt vé online”

**Mô tả ngắn:**  
Khách hàng lựa chọn suất diễn, chọn ghế và tạo đơn đặt vé.

**Tác nhân chính:** Khách hàng

**Tiền điều kiện:**  
- Hệ thống hoạt động bình thường.
- Còn ghế trống.

**Hậu điều kiện:**  
- Đơn đặt vé được tạo.
- Ghế được giữ tạm thời.

**Luồng sự kiện chính**

1. Khách hàng truy cập hệ thống.
2. Hệ thống hiển thị danh sách chương trình.
3. Khách chọn suất diễn.
4. Hệ thống hiển thị sơ đồ ghế.
5. Khách chọn ghế.
6. Hệ thống giữ ghế tạm thời.
7. Khách xác nhận đặt vé.
8. Hệ thống tạo đơn đặt vé.
9. Use case kết thúc.

---

### 2.4.2. UC “Thanh toán online”

**Mô tả ngắn:**  
Khách hàng thực hiện thanh toán online cho đơn đặt vé.

**Tác nhân chính:**  
- Khách hàng
- Cổng thanh toán

**Tiền điều kiện:**  
- Đã có đơn đặt vé ở trạng thái chờ thanh toán.

**Hậu điều kiện:**  
- Vé được xác nhận thanh toán.
- Ghế chuyển sang trạng thái đã bán.

**Luồng sự kiện chính**

1. Khách chọn hình thức thanh toán online.
2. Hệ thống chuyển hướng sang cổng thanh toán.
3. Khách nhập thông tin thanh toán.
4. Cổng thanh toán xử lý giao dịch.
5. Hệ thống nhận kết quả thanh toán thành công.
6. Hệ thống:
   - cập nhật trạng thái đơn = “Đã thanh toán”,
   - cập nhật trạng thái ghế = “Đã bán”,
   - phát hành vé điện tử.
7. Use case kết thúc.

**Các luồng ngoại lệ/tương đương**

- 3a. Thanh toán thất bại: hệ thống thông báo lỗi.
- 4a. Mất kết nối cổng thanh toán: hệ thống giữ ghế tạm thời.
- 5a. Phát hành vé thất bại: hệ thống ghi log lỗi.

---

### 2.4.3. UC “Giao vé tiền mặt”

còn trống.  
Sự kiện kích hoạt: Có đơn đặt vé chọn hình thức thanh toán tiền mặt.  
Loại sự kiện: Sự kiện bên ngoài.

#### Luồng sự kiện chính

1. Nhân viên giao vé đăng nhập và chọn chức năng “Danh sách đơn cần giao”.
2. Hệ thống hiển thị các đơn đặt vé thanh toán tiền mặt, trạng thái “Chờ giao”.
3. Nhân viên chọn 1 đơn để giao, xem thông tin khách hàng và địa chỉ giao vé.
4. Nhân viên giao vé tới địa chỉ khách, thu tiền.
5. Nhân viên cập nhật kết quả giao = “Giao thành công”.
6. Hệ thống:
   a. cập nhật đơn đặt vé = “Đã bán”,  
   b. cập nhật ghế = “Đã bán”,  
   c. ghi nhận doanh thu tiền mặt.
7. Use case kết thúc.

#### Các luồng ngoại lệ/ tương đương

- 3a. Thanh toán thất bại / thẻ không hợp lệ: hệ thống hiển thị thông báo lỗi và cho phép khách thử lại hoặc chuyển sang hình thức thanh toán tiền mặt.
- 4a. Không liên lạc được cổng thanh toán: hệ thống giữ đơn ở trạng thái “Chờ thanh toán”, không bán ghế cho người khác trong một khoảng thời gian.
- 5a. Lưu vé thất bại: hệ thống báo lỗi nội bộ và ghi log, trạng thái vé vẫn là “Đã thanh toán” để tránh mất giao dịch.

---

## 2.6. Sơ đồ hoạt động (Activity Diagram)

### 2.6.1. Sơ đồ hoạt động “Đặt vé online”

Hình 2.3 – Activity diagram UC “Đặt vé online”.

### 2.6.2. Sơ đồ hoạt động “Thanh toán tiền mặt”

Hình 2.4 – Activity diagram UC “Thanh toán tiền mặt”.

### 2.6.3. Sơ đồ hoạt động “Lập báo cáo doanh thu”

Hình 2.5 – Activity diagram “Lập báo cáo doanh thu”.

---

## 2.7. Lớp lĩnh vực cho từng Use Case (Domain Class Diagram)

### 2.7.1. Sơ đồ lớp lĩnh vực “Đặt vé Online”

Hình 2.6 – Domain Class UC “Đặt vé online”.

### 2.7.1. Sơ đồ lớp lĩnh vực “Thanh toán Online”

Hình 2.7 – Domain Class UC “Thanh toán online”.

### 2.7.1. Sơ đồ lớp lĩnh vực “Giao vé tiền mặt”

Hình 2.8 – Domain Class UC “Giao vé tiền mặt”.

---

## 2.8. Sơ đồ trình tự hệ thống (System Sequence Diagram – SSD)

### 2.8.1. Sơ đồ trình tự hệ thống UC Đặt vé Online

Hình 2.9 – SSD UC “Đặt vé online”.

### 2.8.2. Sơ đồ trình tự hệ thống UC Giao vé tiền mặt

Hình 2.10 – SSD UC “Giao vé tiền mặt”.

---

## 2.9. Sơ đồ máy trạng thái (State Machine Diagram)

### 2.9.1. Đối tượng Ghế

Hình 2.11 – State Diagram đối tượng “Ghế”.

### 2.9.2. Đối tượng Đơn đặt vé

Hình 2.12 – State Diagram đối tượng “Đơn Đặt Vé”.

---

## 2.10. Bảng CRUD – (Use Case × Lớp lĩnh vực)

| Lớp | UC03 – Đặt vé online | UC04 – Thanh toán online | UC05 – Giao vé tiền mặt |
|---|---|---|---|
| KhachHang | R | R | R |
| ChuongTrinh | R | R | R |
| SuatDien | R | R | R |
| GheNgoi | R / U | U | U |
| DonDatVe | C / U | U | U |
| Ve | R | U | U |
| YeuCauThanhToan | – | C / U | – |
| GiaoDichOnline | – | C / U | – |
| PhieuGiaoVe | – | – | C / U |
| ThanhToanTienMat | – | – | C / U |

Bảng 2.6 – Ma trận CRUD hệ thống đặt vé.

---

# Phần 3. THIẾT KẾ HỆ THỐNG

## 3.1. Sơ đồ tuần tự mức nghiệp vụ (Business Sequence Diagram)

### 3.1.1. UC “Đặt vé Online”

Hình 3.1 – Sequence Diagram nghiệp vụ “Đặt vé online”.

### 3.1.2. UC “Thanh toán Online”

Hình 3.2 – Sequence nghiệp vụ “Thanh toán online”.

### 3.1.3. UC “Giao vé tiền mặt”

Hình 3.3 – Sequence nghiệp vụ “Giao vé tiền mặt”.

---

## 3.2. Sơ đồ tuần tự mức thực tế

### 3.2.1. UC “Đặt vé online”

Hình 3.4 – Sequence diagram mức thực tế UC “Đặt vé online”.

### 3.2.2. UC “Thanh toán Online”

Hình 3.5 – Sequence Diagram mức thực tế UC “Thanh toán online”.

### 3.2.3. Giao vé tiền mặt

Hình 3.5 – Sequence Diagram mức thực tế UC “Giao vé tiền mặt”.

---

## 3.3. Sơ đồ lớp thiết kế (Design Class Diagram)

### 3.3.1. Sơ đồ lớp tổng thể

Hình 3.7 – Class Diagram tổng thể.

### 3.3.2. Mô tả lớp và trách nhiệm

| STT | Tên lớp | Trách nhiệm chính |
|---|---|---|
| 1 | KhachHang | Lưu trữ thông tin định danh của người mua vé bao gồm họ tên, email, số điện thoại và địa chỉ. |
| 2 | ChuongTrinh | Quản lý thông tin chung về các buổi biểu diễn nghệ thuật như tên chương trình và mô tả nội dung. |
| 3 | SuatDien | Quản lý thông tin cụ thể về thời gian diễn (ngày, giờ) và tỷ lệ giảm giá áp dụng cho suất diễn đó. |
| 4 | GheNgoi | Quản lý trạng thái vật lý của từng vị trí ghế (Còn trống, Tạm giữ, Đã bán) và hạng ghế tương ứng. |
| 5 | DonDatVe | Thực hiện tính toán tổng tiền, lưu giữ phương thức thanh toán và quản lý vòng đời của đơn hàng (Xác nhận hoặc Hủy đơn). |
| 6 | Ve | Đối tượng trung gian liên kết giữa đơn đặt vé và vị trí ghế cụ thể, lưu trữ đơn giá tại thời điểm bán. |
| 7 | YeuCauThanhToan | Chịu trách nhiệm khởi tạo các tham số cần thiết để gửi tới hệ thống thanh toán bên thứ ba. |
| 8 | GiaoDichOnline | Lưu vết lịch sử thanh toán trực tuyến, mã tham chiếu và trạng thái phản hồi từ cổng thanh toán. |
| 9 | PhieuGiaoVe | Quản lý thông tin điều phối giao vé tận nơi, bao gồm ngày giao, kết quả giao và các ghi chú từ nhân viên. |
| 10 | ThanhToanTienMat | Ghi nhận số tiền thực thu và thời điểm xác nhận thanh toán trực tiếp từ khách hàng. |
| 11 | DatVeController | Điều khiển luồng nghiệp vụ đặt vé: lấy danh sách suất diễn, kiểm tra trạng thái ghế và khởi tạo đơn hàng. |
| 12 | ThanhToanController | Xử lý logic thanh toán online và cập nhật kết quả giao dịch vào hệ thống dữ liệu. |
| 13 | GiaoVeController | Cung cấp danh sách đơn cần giao cho nhân viên và cập nhật trạng thái đơn hàng dựa trên kết quả giao thực tế. |

Bảng 3.1 – Mô tả lớp & trách nhiệm.

---

### 3.3.3. Đặc tả chi tiết lớp và phương thức

| Tên lớp | Access Modifier | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|---|---|---|---|---|
| ChuongTrinh | Private | maCT | String | Mã chương trình |
| ChuongTrinh | Private | tenCT | String | Tên chương trình |
| ChuongTrinh | Private | moTa | String | Mô tả chương trình |
| SuatDien | Private | maSuat | String | Mã suất diễn |
| SuatDien | Private | ngayGio | Date | Thời gian biểu diễn |
| SuatDien | Public | tyLeGiam | double | Tỷ lệ giảm giá (0.3 cho thứ Tư) |
| GheNgoi | Private | soGhe | String | Số hiệu ghế |
| GheNgoi | Private | hangGhe | String | Hạng ghế (Vip, Thường) |
| GheNgoi | Public | trangThai | String | Trạng thái ghế (ConTrong, TamGiu, DaBan) |
| KhachHang | Private | maKH | String | Mã khách hàng |
| KhachHang | Private | hoTen | String | Họ tên khách hàng |
| KhachHang | Private | email | String | Email liên lạc |
| KhachHang | Private | soDienThoai | String | Số điện thoại |
| KhachHang | Private | diaChi | String | Địa chỉ nhận vé |
| DonDatVe | Private | maDon | String | Mã đơn hàng |
| DonDatVe | Private | ngayDat | Date | Ngày khách đặt vé |
| DonDatVe | Public | tongTien | double | Tổng tiền đơn hàng |
| DonDatVe | Public | trangThai | String | Trạng thái đơn (ChoThanhToan, DaThanhToan) |
| Ve | Private | maVe | String | Mã định danh vé |
| Ve | Private | donGia | double | Đơn giá vé thực tế |
| Ve | Public | trangThai | String | Trạng thái hiệu lực của vé |
| GiaoDichOnline | Private | maGD | String | Mã giao dịch ngân hàng |
| GiaoDichOnline | Private | thoiGian | Date | Thời điểm thanh toán |
| GiaoDichOnline | Public | trangThai | String | Trạng thái (Thành công/Thất bại) |
| PhieuGiaoVe | Private | maPhieu | String | Mã phiếu điều phối giao |
| PhieuGiaoVe | Private | ngayGiao | Date | Ngày nhân viên đi giao |
| PhieuGiaoVe | Public | ketQua | String | Kết quả (Giao thành công/Khách từ chối) |
| ThanhToanTienMat | Private | maTT | String | Mã chứng từ thu tiền |
| ThanhToanTienMat | Public | soTien | double | Số tiền thực thu tại chỗ |
| ThanhToanTienMat | Public | trangThai | String | Trạng thái xác nhận của kế toán |

Bảng 3.2 – Chi tiết thuộc tính & kiểu dữ liệu cho từng lớp.

---

| Tên lớp | Access Modifier | Tên phương thức | Trách nhiệm |
|---|---|---|---|
| DatVeController | Public | layDanhSachSuatDien() | Truy vấn lịch diễn từ cơ sở dữ liệu |
| DatVeController | Public | tamGiuGhe() | Chuyển trạng thái ghế sang 'TamGiu' khi khách chọn |
| DatVeController | Public | tinhTongTien() | Tính tiền dựa trên số lượng vé và giảm giá thứ Tư |
| ThanhToanController | Public | taoYeuCauThanhToan() | Khởi tạo giao dịch với cổng thanh toán |
| ThanhToanController | Public | capNhatKetQuaGD() | Ghi nhận phản hồi thành công/thất bại từ cổng thanh toán |
| GiaoVeController | Public | layDanhSachDonTienMat() | Lấy danh sách các đơn hàng chờ giao tận nơi |
| GiaoVeController | Public | capNhatKetQuaGiao() | Cập nhật trạng thái 'DaBan' hoặc hoàn lại ghế trống |

Bảng 3.3 – Đặc tả chi tiết các phương thức.

---

## 3.4. Thẻ CRC (Class–Responsibility–Collaboration)

### 3.4.1. Lớp DonDatVe

**Class:** DonDatVe

| Responsibilities (Trách nhiệm) | Collaborators (Cộng tác) |
|---|---|
| Lưu trữ và quản lý thông tin mã đơn hàng, ngày đặt | KhachHang |
| Tính toán tổng tiền dựa trên danh sách vé và ưu đãi | Ve |
| Quản lý trạng thái đơn hàng (Chờ thanh toán, Đã bán, Đã hủy) | SuatDien |
| Xác nhận thanh toán và thực hiện hủy đơn khi có yêu cầu | YeuCauThanhToan |
| Gắn kết thông tin giao vé đối với hình thức thanh toán tiền mặt | PhieuGiaoVe |

Bảng 3.3 – CRC lớp DonDatVe.

---

### 3.4.2. Lớp ThanhToan

**Class:** ThanhToan

| Responsibilities (Trách nhiệm) | Collaborators (Cộng tác) |
|---|---|
| Lưu trữ thông tin định danh giao dịch, ngày thanh toán và số tiền thực thu | DonDatVe |
| Ghi nhận và quản lý các trạng thái của giao dịch (Thành công, Thất bại, Chờ xử lý) | CongThanhToan |
| Phối hợp với lớp DonDatVe để xác nhận hoàn tất nghĩa vụ tài chính của khách hàng | GiaoDichOnline |
| Khởi tạo các tham số cần thiết để kết nối với cổng thanh toán trực tuyến | ThanhToanTienMat |
| Lưu vết mã tham chiếu từ hệ thống ngân hàng để phục vụ đối soát và báo cáo | PhieuGiaoVe |

Bảng 3.4 – CRC lớp ThanhToan.

---

## 3.5. Thiết kế cơ sở dữ liệu

### 3.5.1. Sơ đồ ERD chung của hệ thống

Hình 3.7 – ERD hệ thống.

---

### 3.5.2. Đặc tả chi tiết bảng

#### a. Bảng KhachHang (Khách hàng)

Mô tả: Lưu trữ thông tin cá nhân của khách hàng để thực hiện đặt vé và giao vé.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maKH | INT | PK, NOT NULL, Identity | Mã khách hàng (Tự tăng) |
| hoTen | NVARCHAR(100) | NOT NULL | Họ và tên khách hàng |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Địa chỉ email để nhận vé điện tử |
| soDienThoai | VARCHAR(15) | NOT NULL | Số điện thoại liên lạc |
| diaChi | NVARCHAR(255) | NULL | Địa chỉ khách hàng (Dùng cho giao vé tận nơi) |

---

#### b. Bảng SuatDien (Suất diễn)

Mô tả: Chi tiết về thời gian biểu diễn của các chương trình nghệ thuật.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maSuat | INT | PK, NOT NULL, Identity | Mã suất diễn duy nhất |
| maCT | INT | FK, NOT NULL (Ref ChuongTrinh) | Liên kết với chương trình biểu diễn |
| ngayGio | DATETIME | NOT NULL | Thời gian bắt đầu suất diễn |
| tyLeGiam | DOUBLE | DEFAULT 0 | Tỷ lệ giảm giá (ví dụ 0.3 cho thứ Tư) |

---

#### c. Bảng GheNgoi (Ghế ngồi)

Mô tả: Quản lý vị trí và trạng thái của từng ghế trong một suất diễn cụ thể.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maGhe | INT | PK, NOT NULL, Identity | Mã định danh ghế ngồi |
| maSuat | INT | FK, NOT NULL (Ref SuatDien) | Thuộc về suất diễn nào |
| soGhe | VARCHAR(10) | NOT NULL | Số hiệu ghế (ví dụ: A1, B12) |
| hangGhe | NVARCHAR(20) | NOT NULL | Loại hạng ghế (VIP, THƯỜNG) |
| trangThai | NVARCHAR(20) | NOT NULL | Tình trạng (CONTRONG, TAMGIU, DABAN) |

---

#### d. Bảng DonDatVe (Đơn đặt vé)

Mô tả: Thông tin tổng quát về yêu cầu đặt vé của khách hàng.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maDon | INT | PK, NOT NULL, Identity | Mã đơn đặt vé |
| maKH | INT | FK, NOT NULL (Ref KhachHang) | Mã khách hàng thực hiện đặt |
| ngayDat | DATETIME | DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo yêu cầu đặt vé |
| tongTien | DOUBLE | NOT NULL, CHECK (>=0) | Tổng giá trị đơn hàng sau khi giảm giá |
| phuongThucTT | NVARCHAR(20) | NOT NULL | Hình thức (ONLINE, TIENMAT) |
| trangThai | NVARCHAR(20) | NOT NULL | Trạng thái (CHOTHANHTOAN, DABAN, DAHUY) |

---

#### e. Bảng Ve (Chi tiết vé)

Mô tả: Lưu trữ chi tiết từng vé trong một đơn hàng, bao gồm đơn giá tại thời điểm bán.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maVe | INT | PK, NOT NULL, Identity | Mã định danh vé điện tử |
| maDon | INT | FK, NOT NULL (Ref DonDatVe) | Liên kết tới đơn hàng tổng |
| maGhe | INT | FK, NOT NULL (Ref GheNgoi) | Xác định vị trí ghế ngồi cụ thể |
| donGia | DOUBLE | NOT NULL | Giá vé áp dụng sau khi tính toán giảm giá |

---

#### f. Bảng ThanhToan (Giao dịch)

Mô tả: Ghi nhận lịch sử thanh toán cho các đơn đặt vé.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maTT | INT | PK, NOT NULL, Identity | Mã chứng từ thanh toán |
| maDon | INT | FK, UNIQUE (Ref DonDatVe) | Liên kết 1-1 với đơn đặt vé |
| loaiTT | NVARCHAR(20) | NOT NULL | Loại hình (GIAODICHONLINE, TIENMAT) |
| soTien | DOUBLE | NOT NULL | Số tiền thực thu |
| maThamChieu | VARCHAR(50) | NULL | Mã GD ngân hàng hoặc mã Phiếu giao vé |
| trangThai | NVARCHAR(20) | NOT NULL | Kết quả (THANHCONG, THATBAI) |

---

#### g. Bảng ChuongTrinh (Chương trình biểu diễn)

Mô tả: Lưu trữ danh mục các chương trình nghệ thuật của trung tâm.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maCT | INT | PK, NOT NULL, Identity | Mã định danh chương trình |
| tenCT | NVARCHAR(255) | NOT NULL | Tên chương trình biểu diễn |
| moTa | TEXT | NULL | Mô tả chi tiết về nội dung chương trình |

---

#### h. Bảng PhieuGiaoVe (Phiếu giao vé)

Mô tả: Quản lý trạng thái và kết quả giao vé cho hình thức thanh toán tiền mặt.

| Tên Cột | Kiểu dữ liệu | Ràng buộc (Constraints) | Mô tả |
|---|---|---|---|
| maPhieu | INT | PK, NOT NULL, Identity | Mã phiếu giao vé |
| maDon | INT | FK, NOT NULL (Ref DonDatVe) | Liên kết với đơn đặt vé cần giao |
| ngayGiao | DATE | NOT NULL | Ngày thực hiện giao vé cho khách |
| ketQua | NVARCHAR(50) | NOT NULL | Kết quả giao (ThanhCong, KhachTuChoi) |
| ghiChu | TEXT | NULL | Ghi chú thêm từ nhân viên giao vé |

---

## 3.6. Kiến trúc hệ thống

### 3.6.1. Kiến trúc phân tầng hệ thống

Hình 3.8 – Kiến trúc phân tầng hệ thống.

Hệ thống được thiết kế theo kiến trúc phân tầng (Multi-tier Architecture) nhằm đảm bảo tính độc lập giữa các thành phần, dễ dàng bảo trì và mở rộng.

#### 1. Tầng giao diện (Presentation Layer)

Chức năng: Là lớp tiếp xúc trực tiếp với người dùng, chịu trách nhiệm nhận dữ liệu đầu vào và hiển thị kết quả xử lý.

Các thành phần chính:
- UI_DatVe
- UI_ThanhToan
- UI_GiaoVe

#### 2. Tầng xử lý nghiệp vụ (Business Logic Layer)

Chức năng: Tiếp nhận các yêu cầu (Request) từ tầng giao diện để xử lý các logic nghiệp vụ lõi của hệ thống.

Các thành phần chính:
- DatVeController
- ThanhToanController
- GiaoVeController

#### 3. Tầng truy xuất dữ liệu (Data Access Layer)

Chức năng: Đóng vai trò cầu nối giữa tầng nghiệp vụ và cơ sở dữ liệu.

Các thành phần chính:
- Entity Framework / DAO
- Domain Classes

#### 4. Tầng cơ sở dữ liệu (Database Layer)

Chức năng: Lưu trữ toàn bộ dữ liệu của hệ thống.

Công nghệ sử dụng:
- SQL Server
- MySQL

---

### 3.6.2. Package Diagram hệ thống đặt vé

Hình 3.9 – Package Diagram.

Hệ thống được chia thành 4 package chính:
- booking.presentation
- booking.business
- booking.domain
- booking.infrastructure

---

### 3.6.3. Deployment Diagram Hệ thống đặt vé

Hình 3.10 – Deployment Diagram.

Các node chính:
1. Client Device
2. Web Server
3. Database Server
4. External Payment Provider

Các giao thức sử dụng:
- HTTP/HTTPS
- JDBC/TCP-IP
- HTTPS/REST API

---

# Phần 4. GIAO DIỆN NGƯỜI DÙNG

## 4.1. Quy chuẩn giao diện

| Thành phần | Quy chuẩn thiết kế | Ý nghĩa/Lý do chọn |
|---|---|---|
| Màu sắc chủ đạo | Primary Blue (#2563eb) | Tạo cảm giác chuyên nghiệp, tin cậy |
| Màu sắc trạng thái | Success, Warning, Danger | Nhận diện nhanh kết quả giao dịch |
| Phân loại khu vực | VIP, Standard, Economy | Phân biệt hạng vé trực quan |
| Trạng thái ghế | Trống, Đang chọn, Đã bán | Hiển thị tình trạng ghế |
| Font chữ | Inter (Sans-serif) | Tối ưu hiển thị |
| Kích thước chữ | 12px – 36px | Phân cấp thông tin |
| Hệ thống Icon | Lucide React | Đồng bộ giao diện |
| Bo góc | Rounded-lg / Rounded-md | Hiện đại, mềm mại |
| Bóng đổ | Shadow-md / Shadow-lg | Tạo chiều sâu |
| Bố cục | Grid System | Responsive |

---

## 4.2. Thiết kế form giao diện

### 4.2.1. Form “Đặt vé Online”

Hình 4.1 – Form “Đặt vé online”.

### 4.2.2. Form “Thanh toán”

Hình 4.2 – Form “Thanh toán online & in vé”.

---

## 4.3. Sơ đồ điều hướng (Navigation Diagram)

Hình 4.4 – Navigation Diagram.

---

# Phần 5. CÀI ĐẶT MINH HỌA (FRONT-END DEMO)

## 5.1. Môi trường và công cụ

### 5.1.1. Môi trường phát triển và IDE

- Hệ điều hành: Windows 10/11 hoặc macOS.
- Visual Studio Code v1.85+.
- Node.js v18+.
- npm v10+.
- Google Chrome, Firefox, Edge.

---

### 5.1.2. Ngôn ngữ và Framework chính

- HTML5
- CSS3
- JavaScript (ES6+)
- JSX
- React.js v19.2.0
- Vite v7.2.5
- Tailwind CSS v3.4.19
- React Router DOM v7.12.0

---

### 5.1.3. Thư viện bổ trợ và công cụ kiểm soát

- Lucide React v0.562.0
- Recharts v3.6.0
- qrcode.react v4.2.0
- Axios v1.13.2
- date-fns v4.1.0

---

## 5.2. Cấu trúc thư mục chương trình

### 5.2.1. Sơ đồ cây thư mục

```bash
ticket-booking-frontend/
├── public/ # Tài nguyên tĩnh (Favicon, logos)
├── src/ # Mã nguồn chính
│ ├── assets/ # Hình ảnh, tài nguyên phương tiện
│ ├── components/ # Các thành phần giao diện tái sử dụng
│ │ ├── ui/ # UI cơ bản (Button, Input, Card, Alert...)
│ │ ├── admin/ # Thành phần dành riêng cho quản trị
│ │ └── Layout.jsx # Khung bao quát ứng dụng
│ ├── pages/ # Các trang giao diện chính (Routes)
│ ├── contexts/ # Quản lý trạng thái toàn cục (AuthContext)
│ ├── hooks/ # Các React Hooks tùy chỉnh (useBooking, useDiscount)
│ ├── services/ # Xử lý gọi API và logic nghiệp vụ
│ ├── utils/ # Các hàm tiện ích và hằng số
│ ├── App.jsx # Cấu hình routing chính
│ └── main.jsx # Điểm khởi đầu của ứng dụng
├── tailwind.config.js # Cấu hình Tailwind CSS
└── package.json # Quản lý thư viện phụ thuộc và scripts
## 5.2.2. Mô tả chức năng các thư mục chính

### 1. `src/components:`

- Thư mục `ui` chứa các thành phần nhỏ nhất như nút bấm, ô nhập liệu, thông báo được thiết kế theo quy chuẩn giao diện (Bảng 4.1).
- Chứa các thành phần phức tạp như `SeatingChart` (Sơ đồ 500 ghế) và `BookingSummary` (Tóm tắt đơn hàng).

### 2. `src/pages:`

- Chứa mã nguồn của từng trang riêng biệt như Trang chủ, Chi tiết show, Giỏ hàng, và Dashboard quản lý.
- Mỗi file trong đây tương ứng với một đường dẫn (`route`) cụ thể trên trình duyệt.

### 3. `src/services:`

- Lớp trung gian thực hiện các yêu cầu HTTP đến máy chủ hoặc sử dụng `mockService` để chạy demo không cần backend.
- Đảm bảo tính đóng gói của logic truy xuất dữ liệu.

### 4. `src/hooks:`

- Chứa logic nghiệp vụ đặc thù như `useWednesdayDiscount` để tự động tính toán giảm giá 30% cho các suất diễn vào thứ Tư.
- Quản lý trạng thái chọn ghế và tính tiền thông qua `useBooking`.

### 5. `src/utils:`

- Lưu trữ các hằng số (`constants.js`) như bảng màu cho Zone A, Zone B.
- Chứa các hàm định dạng giá tiền (`priceUtils.js`) và định dạng ngày tháng (`dateUtils.js`).

---

# 5.3. Giao diện minh hoạ

## Hình 5.1: Giao diện đăng nhập/Đăng kí

## Hình 5.2. Giao diện trang chủ

## Hình 5.3. Giao diện đặt vé

## Hình 5.4. Giao diện thanh toán

## Hình 5.5. Giao diện danh sách vé điện tử

---

# Phần 6. Kết luận và hướng phát triển

## 6.1. Kết luận

Sau thời gian nghiên cứu và thực hiện đồ án Project II với đề tài **"Hệ thống đặt vé xem biểu diễn trực tuyến"**, các nhiệm vụ, mục tiêu đề ra ban đầu cơ bản đã hoàn thành:

### 1. Về mặt nghiệp vụ:

- Nắm vững quy trình bán vé tại các trung tâm biểu diễn, từ khâu quản lý suất diễn, sơ đồ ghế đến các phương thức thanh toán đa dạng.
- Giải quyết bài toán đặc thù về giữ chỗ theo thời gian thực và chính sách ưu đãi tự động (giảm giá 30% ngày thứ Tư).

### 2. Về mặt phân tích thiết kế:

- Hoàn thiện bộ hồ sơ thiết kế hệ thống theo chuẩn OOAD với đầy đủ các sơ đồ UML:
  - Use Case
  - Activity
  - SSD
  - Sequence
  - Class
  - Deployment
- Thiết kế cơ sở dữ liệu quan hệ đạt chuẩn 3NF, đảm bảo tính toàn vẹn và tối ưu trong truy xuất dữ liệu.

### 3. Về mặt cài đặt thực nghiệm:

- Xây dựng thành công phiên bản Front-end demo bằng công nghệ React.js và Tailwind CSS.
- Triển khai được các tính năng cốt lõi:
  - chọn ghế trên sơ đồ 500 vị trí,
  - tính toán đơn giá thực tế,
  - mô phỏng luồng thanh toán trực tuyến.
- Quản lý trạng thái ứng dụng hiệu quả thông qua React Context API và Custom Hooks.

Dù đã đạt được những kết quả khả quan, hệ thống vẫn còn một số hạn chế như chưa có phần Back-end thực tế để xử lý lưu trữ lâu dài và chưa tích hợp cổng thanh toán thật.

---

## 6.2. Hướng phát triển

Để hệ thống trở nên hoàn thiện và có tính ứng dụng cao hơn trong thực tế, định hướng các mục tiêu phát triển tiếp theo của sản phẩm như sau:

### 1) Hoàn thiện kiến trúc phần mềm:

- Xây dựng hệ thống Back-end hoàn chỉnh sử dụng Node.js (Express) hoặc Java (Spring Boot) để quản lý dữ liệu tập trung.
- Triển khai kiến trúc Microservices để tách biệt dịch vụ thanh toán và dịch vụ quản lý vé, tăng khả năng mở rộng.

### 2) Nâng cấp công nghệ và tính năng:

- Sử dụng WebSockets (Socket.io) để cập nhật trạng thái ghế trống theo thời gian thực (Real-time) cho tất cả khách hàng cùng lúc.
- Tích hợp các cổng thanh toán thực tế tại Việt Nam như:
  - VNPAY
  - MoMo
  - ZaloPay  
  thông qua môi trường Sandbox.
- Phát triển tính năng quét mã QR trên vé điện tử bằng ứng dụng di động để hỗ trợ nhân viên soát vé tại cửa (Check-in).

### 3) Ứng dụng khoa học dữ liệu (DS/ML):

- Xây dựng hệ thống gợi ý (*Recommendation System*) các buổi biểu diễn dựa trên lịch sử đặt vé và hành vi tìm kiếm của khách hàng.
- Áp dụng các mô hình học máy để dự báo nhu cầu mua vé, hỗ trợ quản lý điều chỉnh giá vé linh hoạt (*Dynamic Pricing*) nhằm tối ưu hóa doanh thu.
- Phân tích dữ liệu phản hồi của khách hàng sau mỗi buổi diễn để đánh giá chất lượng và cải thiện dịch vụ.

---

# TÀI LIỆU THAM KHẢO

[1] Vite contributors, *"Vite - Next Generation Frontend Tooling,"* Vitejs.dev, 2026. [Online].  
Available: <https://vitejs.dev>.

[2] Meta Platforms, Inc., *"React - The library for web and native user interfaces,"* React.dev, 2026. [Online].  
Available: <https://react.dev>.

[3] Tailwind Labs Inc., *"Tailwind CSS - Rapidly build modern websites without ever leaving your HTML,"* Tailwindcss.com, 2026. [Online].  
Available: <https://tailwindcss.com/docs>.

[4] Lucide contributors, *"Lucide - Beautiful & consistent icons,"* Lucide.dev, 2026. [Online].  
Available: <https://lucide.dev>.

[5] Remix Software, Inc., *"React Router - Declarative routing for React,"* Reactrouter.com, 2026. [Online].  
Available: <https://reactrouter.com>.

[6] Axios contributors, *"Axios - Promise based HTTP client for the browser and node.js,"* Axios-http.com, 2026. [Online].  
Available: <https://axios-http.com>.

[7] MDN contributors, *"MDN Web Docs - Resources for developers, by developers,"* Developer.mozilla.org, 2026. [Online].  
Available: <https://developer.mozilla.org>.

[8] PlantUML, *"PlantUML Language Reference Guide,"* Plantuml.com, 2026. [Online].  
Available: <https://plantuml.com>.