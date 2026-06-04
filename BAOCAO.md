# Project II - Hệ thống đặt vé xem phim trực tuyến (QuickShow)

## Phần 1. GIỚI THIỆU ĐỀ TÀI

### 1.1. Tổng quan đề tài

**QuickShow** là hệ thống đặt vé xem phim trực tuyến được xây dựng nhằm hỗ trợ khách hàng tìm kiếm, đặt vé và thanh toán nhanh chóng, thuận tiện mà không cần đến trực tiếp rạp chiếu phim. Hệ thống cho phép người dùng xem danh sách phim đang chiếu, chọn ngày và suất chiếu, chọn ghế ngồi tương tác, thực hiện thanh toán online hoặc trực tiếp, và tra cứu vé điện tử.

Ngoài giao diện dành cho khách hàng, hệ thống còn tích hợp bảng quản trị (Admin Dashboard) cho phép quản lý viên thêm phim, quản lý suất chiếu, xem danh sách đặt chỗ và theo dõi doanh thu theo thời gian thực.

### 1.2. Mục tiêu hệ thống

- Tin học hóa quy trình đặt vé xem phim tại rạp chiếu.
- Hỗ trợ khách hàng chọn ghế trực quan trên sơ đồ ghế tương tác (10 hàng × 9 ghế = 90 ghế/suất).
- Tích hợp hai hình thức thanh toán: online và trực tiếp (direct).
- Áp dụng chính sách ưu đãi tự động: giảm giá 30% cho tất cả suất chiếu vào ngày thứ Tư.
- Hỗ trợ quản trị viên quản lý phim, suất chiếu và theo dõi tổng doanh thu thu được và doanh thu đang chờ xác nhận.

---

# Phần 2. PHÂN TÍCH HỆ THỐNG

## 2.1. Mô tả bài toán

Hệ thống QuickShow phục vụ việc bán vé cho các suất chiếu phim tại rạp. Người dùng có thể:

- Xem danh sách phim đang chiếu và phim nổi bật.
- Xem trailer và chi tiết thông tin phim.
- Chọn ngày và suất chiếu cụ thể.
- Chọn ghế trên sơ đồ ghế tương tác.
- Thanh toán online (xác nhận ngay) hoặc trực tiếp (cung cấp SĐT và địa chỉ nhận vé).
- Xem lại danh sách đặt chỗ và vé điện tử đã thanh toán.
- Thêm phim vào danh sách yêu thích.

## 2.2. Các tác nhân (Actors)

| Tác nhân | Mô tả |
|---|---|
| **Khách hàng (Customer)** | Người dùng đăng nhập để đặt vé, xem lịch sử và vé điện tử |
| **Quản trị viên (Admin)** | Quản lý phim, suất chiếu, xem toàn bộ đặt chỗ và doanh thu |
| **Hệ thống Mock Service** | Lớp dịch vụ nội bộ xử lý dữ liệu qua localStorage (thay thế backend thực) |

## 2.3. Danh sách Use Case

| Mã UC | Tên Use Case | Tác nhân |
|---|---|---|
| UC01 | Xem danh sách phim & trang chủ | Khách hàng |
| UC02 | Xem chi tiết phim & chọn ngày chiếu | Khách hàng |
| UC03 | Đặt vé (chọn ghế) | Khách hàng |
| UC04 | Thanh toán đặt vé | Khách hàng |
| UC05 | Xem lịch sử đặt chỗ | Khách hàng |
| UC06 | Xem vé điện tử | Khách hàng |
| UC07 | Quản lý phim & suất chiếu | Quản trị viên |
| UC08 | Xem Dashboard & doanh thu | Quản trị viên |

## 2.4. Đặc tả Use Case

### 2.4.1. UC03 – "Đặt vé (chọn ghế)"

**Mô tả ngắn:**
Khách hàng chọn suất chiếu, chọn thời gian, chọn ghế ngồi trên sơ đồ tương tác và xác nhận đặt chỗ.

**Tác nhân chính:** Khách hàng

**Tiền điều kiện:**
- Khách hàng đã đăng nhập với vai trò `customer`.
- Phim còn suất chiếu trong ngày được chọn.
- Còn ghế trống trong suất chiếu đó.

**Hậu điều kiện:**
- Đơn đặt chỗ được tạo với trạng thái `unpaid`.
- Các ghế đã chọn được đánh dấu là `occupied` trong suất chiếu.
- Khách hàng được chuyển hướng sang trang "My Bookings" để hoàn tất thanh toán.

**Luồng sự kiện chính:**

1. Khách hàng truy cập trang chi tiết phim.
2. Hệ thống hiển thị thông tin phim (poster, mô tả, thể loại, thời lượng).
3. Khách chọn ngày chiếu từ danh sách ngày có suất.
4. Hệ thống hiển thị các khung giờ chiếu khả dụng trong ngày đó.
5. Khách chọn khung giờ.
6. Hệ thống hiển thị sơ đồ ghế 10 hàng (A–J) × 9 ghế, tô màu ghế đã đặt.
7. Nếu là suất thứ Tư, hệ thống hiển thị giá gốc bị gạch và giá sau giảm 30%.
8. Khách chọn tối đa 5 ghế (nhấn vào ô ghế).
9. Khách nhấn "Proceed to Checkout".
10. Hệ thống kiểm tra ghế chưa bị đặt bởi người khác.
11. Hệ thống tạo bản ghi đặt chỗ và cập nhật trạng thái ghế.
12. Hệ thống thông báo thành công và điều hướng đến trang quản lý đặt chỗ.

**Các luồng ngoại lệ:**

- 5a. Khách chưa chọn thời gian: hệ thống hiển thị toast cảnh báo "Please select the time first".
- 8a. Chọn quá 5 ghế: hệ thống hiển thị toast "Maximum 5 seats".
- 8b. Ghế đã bị đặt: nút ghế bị vô hiệu hóa, hiển thị màu xám.
- 10a. Ghế bị đặt đồng thời bởi người khác: hệ thống báo lỗi và không tạo đơn.

---

### 2.4.2. UC04 – "Thanh toán đặt vé"

**Mô tả ngắn:**
Khách hàng chọn hình thức thanh toán (online hoặc trực tiếp) để hoàn tất đơn đặt chỗ.

**Tác nhân chính:** Khách hàng

**Tiền điều kiện:**
- Đã có đơn đặt chỗ ở trạng thái `unpaid`.

**Hậu điều kiện:**

- *Thanh toán online:* Trạng thái đơn = `paid`, vé xuất hiện ở "My Tickets".
- *Thanh toán trực tiếp:* Trạng thái đơn = `awaiting-direct-payment`, lưu SĐT và địa chỉ khách hàng.

**Luồng sự kiện chính (Thanh toán Online):**

1. Khách vào trang "My Bookings", nhấn "Pay Now" trên đơn hàng chưa thanh toán.
2. Hệ thống hiển thị panel chọn phương thức: Online / Direct.
3. Khách chọn "Online" và xác nhận.
4. Hệ thống cập nhật trạng thái đơn thành `paid`, ghi nhận `paidAt`.
5. Toast thông báo "Online payment confirmed".
6. Đơn hàng cập nhật hiển thị badge "Paid" màu xanh.

**Luồng sự kiện chính (Thanh toán Trực tiếp):**

1. Khách chọn phương thức "Direct".
2. Hệ thống yêu cầu nhập số điện thoại và địa chỉ nhận vé.
3. Khách nhập thông tin và xác nhận.
4. Hệ thống lưu thông tin, đặt trạng thái = `awaiting-direct-payment`.
5. Badge hiển thị "Pending direct pay" màu vàng.

**Các luồng ngoại lệ:**

- 3a. Thiếu số điện thoại hoặc địa chỉ khi chọn direct: hệ thống hiển thị lỗi validation.

---

### 2.4.3. UC07 – "Quản lý phim & suất chiếu" (Admin)

**Mô tả ngắn:**
Quản trị viên thêm phim mới, tạo suất chiếu, chỉnh sửa và xóa suất chiếu.

**Tác nhân chính:** Quản trị viên

**Tiền điều kiện:**
- Người dùng đăng nhập với vai trò `admin`.

**Hậu điều kiện:**
- Phim và suất chiếu mới được lưu vào hệ thống.
- Phim hiển thị trên trang chủ khách hàng.

**Luồng sự kiện chính:**

1. Admin truy cập trang "Add Shows".
2. Hệ thống cho phép chọn phim từ catalog hiện có hoặc tạo phim mới.
3. Admin nhập thông tin phim (tiêu đề, mô tả, poster, backdrop, thể loại, thời lượng, ngôn ngữ).
4. Admin đặt giá vé và chọn ngày + giờ chiếu.
5. Hệ thống kiểm tra ràng buộc: chỉ một suất/ngày.
6. Hệ thống lưu phim và tạo các bản ghi suất chiếu.
7. Admin có thể vào "List Shows" để chỉnh sửa hoặc xóa suất chiếu đã tạo.

---

## 2.5. Bảng CRUD – (Use Case × Lớp dữ liệu)

| Lớp dữ liệu | UC03 – Đặt vé | UC04 – Thanh toán | UC07 – Quản lý Admin | UC08 – Dashboard |
|---|---|---|---|---|
| User | R | R | R | R |
| Movie | R | R | C / R / U / D | R |
| Show | R / U | R | C / R / U / D | R |
| Booking | C / U | U | R | R |
| OccupiedSeats | R / U | – | R | R |

Bảng 2.1 – Ma trận CRUD hệ thống QuickShow.

---

## 2.6. Sơ đồ hoạt động (Activity Diagram - Mô tả)

### 2.6.1. Hoạt động "Đặt vé"

```
[Khách hàng truy cập trang phim]
        ↓
[Xem chi tiết phim & trailer]
        ↓
[Chọn ngày chiếu]
        ↓
[Chọn khung giờ chiếu]
        ↓ ←── [Suất thứ Tư? → Hiển thị giá -30%]
[Chọn ghế (tối đa 5)]
        ↓
[Nhấn "Proceed to Checkout"]
        ↓
[Kiểm tra ghế còn trống?]
    ↙         ↘
 [Có]        [Không → Báo lỗi]
   ↓
[Tạo Booking (unpaid)]
   ↓
[Chuyển đến My Bookings]
```

### 2.6.2. Hoạt động "Thanh toán"

```
[Khách mở My Bookings]
        ↓
[Nhấn "Pay Now"]
        ↓
[Chọn phương thức]
    ↙         ↘
[Online]    [Direct]
   ↓              ↓
[Xác nhận]   [Nhập SĐT & Địa chỉ]
   ↓              ↓
[paid]    [awaiting-direct-payment]
```

---

## 2.7. Sơ đồ máy trạng thái (State Machine)

### 2.7.1. Đối tượng Ghế (Seat)

```
[Available] → (khách chọn) → [Selected]
[Selected]  → (checkout)   → [Occupied]
[Selected]  → (bỏ chọn)   → [Available]
```

### 2.7.2. Đối tượng Đơn đặt chỗ (Booking)

```
[unpaid]
    ↓ (chọn online)
[paid]

[unpaid]
    ↓ (chọn direct + nhập SĐT/địa chỉ)
[awaiting-direct-payment]
    ↓ (admin xác nhận)
[paid]
```

---

# Phần 3. THIẾT KẾ HỆ THỐNG

## 3.1. Kiến trúc hệ thống

### 3.1.1. Kiến trúc phân tầng

Hệ thống QuickShow được thiết kế theo kiến trúc **Single Page Application (SPA)** với phân tầng rõ ràng:

#### 1. Tầng giao diện (Presentation Layer)

Chức năng: Hiển thị UI và tiếp nhận tương tác người dùng.

Các thành phần chính:

| Thành phần | Mô tả |
|---|---|
| `NavBar.jsx` | Thanh điều hướng chính |
| `HeroSection.jsx` | Banner trang chủ |
| `FeaturedSection.jsx` | Phim nổi bật |
| `TrailersSection.jsx` | Phần xem trailer |
| `SeatLayout.jsx` | Sơ đồ chọn ghế tương tác |
| `BookingPaymentPanel.jsx` | Panel thanh toán đặt chỗ |
| `TicketCard.jsx` | Thẻ vé điện tử |
| `AdminSidebar.jsx` + `AdminNavbar.jsx` | Giao diện quản trị |

#### 2. Tầng xử lý nghiệp vụ (Business Logic Layer)

Chức năng: Chứa logic nghiệp vụ của ứng dụng.

| Module | Trách nhiệm |
|---|---|
| `AuthContext.jsx` | Quản lý trạng thái đăng nhập, phân quyền |
| `ProtectedRoute.jsx` | Bảo vệ route theo vai trò (customer/admin) |
| `mockService.js` | Toàn bộ nghiệp vụ: đặt vé, thanh toán, quản lý phim/suất chiếu |
| `lib/` (dateFormat, timeFormat, isoTimeFormat, kConverter) | Các hàm tiện ích |

#### 3. Tầng truy xuất dữ liệu (Data Access Layer)

Chức năng: Đọc/ghi dữ liệu vào `localStorage` và `IndexedDB`.

| Storage | Dữ liệu |
|---|---|
| `localStorage` | users, movies, shows, bookings |
| `IndexedDB` | Ảnh poster/backdrop (base64) |

#### 4. Tầng dữ liệu (Data Layer)

Dữ liệu được lưu trữ tại client thông qua Web Storage API (localStorage + IndexedDB), phù hợp với mô hình demo không cần backend thực.

---

### 3.1.2. Sơ đồ luồng dữ liệu (Data Flow)

```
[UI Components]
      ↕ props / callbacks
[Pages (React Router Routes)]
      ↕ service calls
[mockService.js (Business Logic)]
      ↕ read/write
[localStorage + IndexedDB]
```

---

## 3.2. Sơ đồ lớp thiết kế (Design Class Diagram)

### 3.2.1. Mô tả lớp và trách nhiệm

| STT | Tên lớp/Module | Trách nhiệm chính |
|---|---|---|
| 1 | `User` | Lưu thông tin định danh người dùng: id, name, email, password, role (customer/admin) |
| 2 | `Movie` | Quản lý thông tin phim: title, overview, poster_path, backdrop_path, runtime, genres, language, tagline |
| 3 | `Show` | Quản lý suất chiếu: movieId, showDateTime, showPrice, occupiedSeats |
| 4 | `Booking` | Quản lý đơn đặt chỗ: userId, showId, amount, bookedSeats, isPaid, paymentMethod, paymentStatus |
| 5 | `AuthContext` | Quản lý trạng thái xác thực toàn ứng dụng: user, login(), logout(), isAuthenticated |
| 6 | `mockService` | Lớp dịch vụ tổng hợp: xử lý tất cả tác vụ CRUD và nghiệp vụ |
| 7 | `imageStorage` | Lưu và truy xuất ảnh base64 trong IndexedDB |

Bảng 3.1 – Mô tả lớp & trách nhiệm.

---

### 3.2.2. Đặc tả chi tiết lớp và thuộc tính

#### Lớp Movie

| Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `_id` | String | Mã định danh duy nhất (`movie-{timestamp}-{slug}`) |
| `title` | String | Tên phim |
| `overview` | String | Mô tả nội dung phim |
| `poster_path` | String | URL hoặc IndexedDB ref ảnh poster |
| `backdrop_path` | String | URL hoặc IndexedDB ref ảnh nền |
| `runtime` | Number | Thời lượng phim (phút) |
| `genres` | Array<{id, name}> | Danh sách thể loại |
| `language` | String | Ngôn ngữ gốc |
| `tagline` | String | Khẩu hiệu phim |

#### Lớp Show (Suất chiếu)

| Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `_id` | String | Mã suất chiếu (`show-{movieId}-{date}-{index}`) |
| `movieId` | String | FK – liên kết đến Movie |
| `showDateTime` | String (ISO) | Thời gian chiếu (ví dụ: `2025-07-23T03:00:00.000Z`) |
| `showPrice` | Number | Giá vé gốc |
| `occupiedSeats` | Object | Map `seatId → userId` các ghế đã đặt |
| `isWednesday` | Boolean (computed) | Có phải suất thứ Tư không |
| `discountedPrice` | Number (computed) | Giá sau giảm (= showPrice × 0.7 nếu thứ Tư) |

#### Lớp Booking (Đặt chỗ)

| Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `_id` | String | Mã đặt chỗ (`booking-{timestamp}`) |
| `userId` | String | FK – người đặt |
| `showId` | String | FK – suất chiếu |
| `amount` | Number | Tổng tiền (đã tính giảm giá nếu thứ Tư) |
| `bookedSeats` | Array<String> | Danh sách ghế đã đặt (ví dụ: ['A1', 'B3']) |
| `isPaid` | Boolean | Trạng thái thanh toán |
| `paymentMethod` | String | `null` / `'online'` / `'direct'` |
| `paymentStatus` | String | `'unpaid'` / `'paid'` / `'awaiting-direct-payment'` |
| `contactPhone` | String | SĐT khách hàng (cho direct) |
| `deliveryAddress` | String | Địa chỉ nhận vé (cho direct) |
| `createdAt` | String (ISO) | Thời điểm tạo đơn |
| `paidAt` | String (ISO) | Thời điểm thanh toán |

Bảng 3.2 – Chi tiết thuộc tính các lớp dữ liệu.

---

### 3.2.3. Đặc tả các phương thức chính (mockService)

| Phương thức | Trách nhiệm |
|---|---|
| `initialize()` | Khởi tạo dữ liệu mặc định vào localStorage nếu chưa có |
| `login(email, password)` | Xác thực người dùng và trả về user object |
| `getMovies()` | Lấy danh sách phim đang có suất chiếu |
| `getMovieCatalog()` | Lấy toàn bộ catalog phim (dành cho admin) |
| `getMovieDetails(movieId)` | Lấy chi tiết phim kèm lịch suất chiếu |
| `getMovieSchedule(movieId)` | Lấy lịch chiếu theo ngày của một phim |
| `getShowById(showId)` | Lấy thông tin chi tiết một suất chiếu (bao gồm ghế đã đặt) |
| `createShow({movieId, movieData, showPrice, dateTimeSelection})` | Tạo phim mới (nếu cần) và suất chiếu |
| `updateShow(showId, payload)` | Cập nhật thời gian hoặc giá vé suất chiếu |
| `deleteShow(showId)` | Xóa suất chiếu và các booking liên quan |
| `bookSeats({showId, seats, userId})` | Đặt ghế và tạo booking mới |
| `submitPayment({bookingId, userId, method, phone, address})` | Xử lý thanh toán theo phương thức |
| `confirmDirectPayment(bookingId)` | Admin xác nhận đã nhận tiền mặt |
| `getMyBookings(userId)` | Lấy danh sách đặt chỗ của một khách hàng |
| `getMyTickets(userId)` | Lấy vé điện tử đã thanh toán |
| `getDashboardStats()` | Thống kê tổng hợp cho admin dashboard |
| `getBookings()` | Lấy toàn bộ danh sách đặt chỗ (admin) |

Bảng 3.3 – Đặc tả chi tiết phương thức mockService.

---

## 3.3. Thẻ CRC (Class–Responsibility–Collaboration)

### 3.3.1. Lớp mockService

**Class:** mockService

| Responsibilities (Trách nhiệm) | Collaborators (Cộng tác) |
|---|---|
| Khởi tạo và quản lý dữ liệu trong localStorage | localStorage, IndexedDB |
| Xác thực người dùng theo email và password | User (DEFAULT_USERS) |
| Đặt ghế, kiểm tra xung đột, tạo booking | Show, Booking |
| Xử lý thanh toán (online / direct) | Booking |
| Tính giá giảm 30% ngày thứ Tư tự động | Show (isWednesdayShow) |
| Cung cấp dữ liệu thống kê cho Admin Dashboard | Booking, Show, Movie |

### 3.3.2. Lớp AuthContext

**Class:** AuthContext

| Responsibilities (Trách nhiệm) | Collaborators (Cộng tác) |
|---|---|
| Lưu trạng thái người dùng hiện tại (user object) | mockService.login() |
| Persist trạng thái đăng nhập qua localStorage | localStorage |
| Cung cấp hàm login() và logout() cho toàn ứng dụng | React Context API |
| Xác định người dùng có đang đăng nhập không (isAuthenticated) | ProtectedRoute |

---

## 3.4. Thiết kế định tuyến (Routing Design)

### 3.4.1. Bảng các Route

| Đường dẫn | Component | Quyền truy cập |
|---|---|---|
| `/` | `Home` | Public |
| `/login` | `Login` | Public |
| `/movies` | `Movie` | Public |
| `/movies/:id` | `MovieDetail` | Public |
| `/movies/:id/:date` | `SeatLayout` | Customer only |
| `/my-bookings` | `MyBooking` | Customer only |
| `/my-tickets` | `MyTickets` | Customer only |
| `/favorite` | `Fav` | Public |
| `/admin` | `Dashboard` | Admin only |
| `/admin/add-shows` | `AddShows` | Admin only |
| `/admin/list-shows` | `ListShows` | Admin only |
| `/admin/list-bookings` | `ListBookings` | Admin only |

Bảng 3.4 – Bảng định tuyến hệ thống.

### 3.4.2. Cơ chế bảo vệ Route

`ProtectedRoute` kiểm tra `user.role` từ `AuthContext` trước khi render. Nếu không đủ quyền, điều hướng về trang đăng nhập.

---

## 3.5. Thiết kế dữ liệu (Data Design)

### 3.5.1. Cấu trúc lưu trữ

Hệ thống sử dụng `localStorage` với 4 key chính:

| Key | Dữ liệu |
|---|---|
| `quickshow_mock_users` | Mảng User objects |
| `quickshow_mock_movies` | Mảng Movie objects |
| `quickshow_mock_shows` | Mảng Show objects |
| `quickshow_mock_bookings` | Mảng Booking objects |

### 3.5.2. Cấu trúc bảng User

| Trường | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | String | PK, unique | Mã định danh (customer-1, admin-1, ...) |
| `name` | String | NOT NULL | Họ tên hiển thị |
| `email` | String | UNIQUE, NOT NULL | Email đăng nhập |
| `password` | String | NOT NULL | Mật khẩu (plain text - demo only) |
| `role` | String | NOT NULL | Vai trò: `'customer'` hoặc `'admin'` |

### 3.5.3. Cấu trúc bảng Movie

| Trường | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `_id` | String | PK, unique | Mã phim tự sinh |
| `title` | String | NOT NULL | Tên phim |
| `overview` | String | NULL | Mô tả nội dung |
| `poster_path` | String | NOT NULL | URL hoặc ref IndexedDB ảnh poster |
| `backdrop_path` | String | NULL | URL hoặc ref IndexedDB ảnh nền |
| `runtime` | Number | DEFAULT 120 | Thời lượng (phút) |
| `genres` | Array | NOT NULL | Mảng {id, name} thể loại |
| `language` | String | DEFAULT 'en' | Mã ngôn ngữ |
| `tagline` | String | NULL | Slogan phim |

### 3.5.4. Cấu trúc bảng Show

| Trường | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `_id` | String | PK, unique | Mã suất chiếu tự sinh |
| `movieId` | String | FK (Movie._id), NOT NULL | Phim được chiếu |
| `showDateTime` | String (ISO) | NOT NULL | Thời gian chiếu |
| `showPrice` | Number | NOT NULL, > 0 | Giá vé |
| `occupiedSeats` | Object | DEFAULT {} | Map ghế đã đặt: `{seatId: userId}` |

### 3.5.5. Cấu trúc bảng Booking

| Trường | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `_id` | String | PK, unique | Mã đặt chỗ tự sinh |
| `userId` | String | FK (User.id), NOT NULL | Khách hàng đặt |
| `showId` | String | FK (Show._id), NOT NULL | Suất chiếu |
| `amount` | Number | NOT NULL, >= 0 | Tổng tiền sau giảm giá |
| `bookedSeats` | Array<String> | NOT NULL | Danh sách ghế đã chọn |
| `isPaid` | Boolean | DEFAULT false | Đã thanh toán hay chưa |
| `paymentMethod` | String | NULL | `'online'` / `'direct'` |
| `paymentStatus` | String | DEFAULT 'unpaid' | Trạng thái thanh toán |
| `contactPhone` | String | NULL | SĐT cho thanh toán direct |
| `deliveryAddress` | String | NULL | Địa chỉ cho thanh toán direct |
| `createdAt` | String (ISO) | NOT NULL | Thời điểm tạo đơn |
| `paidAt` | String (ISO) | NULL | Thời điểm thanh toán |

---

## 3.6. Quy tắc nghiệp vụ đặc thù

### 3.6.1. Chính sách giảm giá thứ Tư

```javascript
// Kiểm tra suất thứ Tư (UTC day = 3)
const isWednesdayShow = (showDateTime) => new Date(showDateTime).getUTCDay() === 3

// Tính giá sau giảm
const getDiscountedPrice = (showPrice, showDateTime) =>
  isWednesdayShow(showDateTime) ? Number((showPrice * 0.7).toFixed(2)) : Number(showPrice)
```

- Áp dụng tự động cho tất cả suất chiếu vào thứ Tư.
- Hiển thị giá gốc gạch ngang và giá mới màu xanh lá.
- Hiển thị thông báo "Wednesday shows get 30% off".

### 3.6.2. Ràng buộc một suất/ngày

```javascript
// Mỗi ngày chỉ được có 1 suất chiếu trong rạp
const hasShowOnDate = (shows, showDate, excludeShowId = null) =>
  shows.some(show => show._id !== excludeShowId && show.showDateTime.slice(0, 10) === showDate)
```

### 3.6.3. Giới hạn chọn ghế

- Tối đa **5 ghế** mỗi lần đặt.
- Ghế đã đặt bởi người khác bị vô hiệu hóa (disabled, màu xám).
- Ghế đang chọn hiển thị màu primary (tím/xanh chủ đạo).

---

# Phần 4. GIAO DIỆN NGƯỜI DÙNG

## 4.1. Quy chuẩn giao diện

| Thành phần | Quy chuẩn thiết kế | Ý nghĩa / Lý do chọn |
|---|---|---|
| Màu sắc chủ đạo | Primary (CSS variable, dạng tím/violet) | Tạo cảm giác hiện đại, sang trọng cho ngành giải trí |
| Nền tối | Dark background (`#0a0a0a` to `#111`) | Phù hợp với không khí rạp chiếu phim |
| Màu trạng thái | Emerald (paid), Amber (pending), Rose (unpaid) | Nhận diện nhanh trạng thái thanh toán |
| Trạng thái ghế | Trong suốt (available), Primary (selected), Xám (occupied) | Phân biệt trực quan trên sơ đồ ghế |
| Font chữ | Inter / System font (sans-serif) | Tối ưu hiển thị, dễ đọc |
| Kích thước chữ | 12px – 36px | Phân cấp thông tin rõ ràng |
| Hệ thống Icon | Lucide React | Đồng bộ, nhất quán trên toàn giao diện |
| Bo góc | Rounded-lg / Rounded-full | Hiện đại, thân thiện |
| Hiệu ứng | hover scale, transition | Tạo chiều sâu, cảm giác sống động |
| Bố cục | Flexbox + CSS Grid + Responsive breakpoints | Tương thích mọi kích thước màn hình |

---

## 4.2. Sơ đồ điều hướng (Navigation Flow)

```
[Trang chủ /]
    ├── [Xem tất cả phim /movies]
    │       └── [Chi tiết phim /movies/:id]
    │               └── [Chọn ghế /movies/:id/:date]  ← Protected (customer)
    │                       └── [My Bookings /my-bookings] ← Sau khi đặt
    ├── [My Bookings /my-bookings]  ← Protected (customer)
    ├── [My Tickets /my-tickets]    ← Protected (customer)
    ├── [Favorite /favorite]
    ├── [Login /login]
    └── [Admin /admin/*]            ← Protected (admin)
            ├── [Dashboard /admin]
            ├── [Add Shows /admin/add-shows]
            ├── [List Shows /admin/list-shows]
            └── [List Bookings /admin/list-bookings]
```

---

## 4.3. Mô tả các màn hình chính

### 4.3.1. Màn hình Trang chủ (`/`)

- **HeroSection**: Banner nổi bật với tên ứng dụng, call-to-action.
- **FeaturedSection**: Danh sách phim nổi bật dạng grid card (poster, tiêu đề, thể loại).
- **TrailersSection**: Phần xem trailer phim.
- **Footer**: Thông tin liên hệ, logo app store/Google Play.

### 4.3.2. Màn hình Chi tiết phim (`/movies/:id`)

- Poster phim + backdrop, thông tin chi tiết (thể loại, thời lượng, ngôn ngữ, mô tả).
- Nút "Watch Trailer" và "Buy Tickets".
- Nút yêu thích (Heart icon).
- Component `DateSelect`: chọn ngày chiếu và điều hướng sang trang chọn ghế.
- Danh sách "You may also like" (4 phim tương tự).

### 4.3.3. Màn hình Chọn ghế (`/movies/:id/:date`)

- Panel trái: danh sách khung giờ chiếu, hiển thị giá (có gạch ngang nếu thứ Tư), số ghế đã đặt.
- Khu vực chính: sơ đồ ghế 10 hàng (A–J) × 9 ghế với màu phân biệt.
- Chú thích: Available / Selected / Booked.
- Nút "Proceed to Checkout" (disabled khi đang xử lý).

### 4.3.4. Màn hình Quản lý đặt chỗ (`/my-bookings`)

- Danh sách card đặt chỗ: poster, tên phim, thời lượng, ngày chiếu, badge trạng thái.
- Hiển thị tổng tiền, số ghế, vị trí ghế.
- Nút "Pay Now" → mở `BookingPaymentPanel` chọn phương thức thanh toán.
- Badge màu: Emerald (Paid), Amber (Pending direct pay), Rose (Unpaid).

### 4.3.5. Màn hình Vé điện tử (`/my-tickets`)

- Danh sách `TicketCard` cho các booking đã thanh toán.
- Hiển thị thông tin vé: tên phim, ngày chiếu, số ghế, tổng tiền.

### 4.3.6. Màn hình Admin Dashboard (`/admin`)

- 5 thẻ thống kê: Total Bookings, Collected Revenue, Pending Direct, Active Shows, Total Users.
- Lưới hiển thị Active Shows (tối đa 6 suất): poster, tên phim, giá, ngày chiếu.

---

# Phần 5. CÀI ĐẶT MINH HỌA (FRONT-END DEMO)

## 5.1. Môi trường và công cụ

### 5.1.1. Môi trường phát triển và IDE

- Hệ điều hành: macOS / Windows 10/11.
- Visual Studio Code v1.85+.
- Node.js v18+.
- npm v10+.
- Google Chrome, Firefox, Edge (hỗ trợ localStorage + IndexedDB).

---

### 5.1.2. Ngôn ngữ và Framework chính

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| HTML5 | – | Cấu trúc trang |
| CSS3 / Tailwind CSS | v4.2.1 | Styling & responsive |
| JavaScript (ES6+) / JSX | – | Logic và UI |
| React.js | v19.2.0 | UI Framework |
| Vite | v7.3.1 | Build Tool & Dev Server |
| React Router DOM | v7.13.1 | Client-side Routing |

---

### 5.1.3. Thư viện bổ trợ

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Lucide React | v0.577.0 | Hệ thống icon SVG |
| React Hot Toast | v2.6.0 | Thông báo toast UX |
| React Player | v3.4.0 | Phát trailer phim |
| @tailwindcss/vite | v4.2.1 | Tích hợp Tailwind với Vite |

---

## 5.2. Cấu trúc thư mục chương trình

### 5.2.1. Sơ đồ cây thư mục

```
quickshow/
└── client/                          # Ứng dụng React frontend
    ├── public/
    │   ├── backgroundImage.png      # Ảnh nền
    │   ├── favicon.svg              # Biểu tượng trang
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   ├── assets.js            # Export tập trung tài nguyên
    │   │   ├── logo.svg             # Logo QuickShow
    │   │   ├── screenImage.svg      # Hình màn chiếu
    │   │   ├── appStore.svg         # Nút App Store
    │   │   ├── googlePlay.svg       # Nút Google Play
    │   │   ├── marvelLogo.svg       # Logo partner
    │   │   └── chartIcon.svg        # Icon biểu đồ
    │   ├── components/
    │   │   ├── NavBar.jsx           # Thanh điều hướng
    │   │   ├── Footer.jsx           # Footer
    │   │   ├── HeroSection.jsx      # Banner trang chủ
    │   │   ├── FeaturedSection.jsx  # Phim nổi bật
    │   │   ├── TrailersSection.jsx  # Phần trailer
    │   │   ├── MovieCard.jsx        # Card phim
    │   │   ├── DateSelect.jsx       # Chọn ngày chiếu
    │   │   ├── BookingPaymentPanel.jsx # Panel thanh toán
    │   │   ├── TicketCard.jsx       # Thẻ vé điện tử
    │   │   ├── Loading.jsx          # Màn hình tải
    │   │   ├── ProtectedRoute.jsx   # Bảo vệ route theo role
    │   │   └── admin/
    │   │       ├── AdminNavbar.jsx  # Navbar quản trị
    │   │       ├── AdminSidebar.jsx # Sidebar quản trị
    │   │       └── Title.jsx        # Tiêu đề trang admin
    │   ├── pages/
    │   │   ├── Home.jsx             # Trang chủ
    │   │   ├── Movie.jsx            # Danh sách phim
    │   │   ├── MovieDetail.jsx      # Chi tiết phim
    │   │   ├── SeatLayout.jsx       # Chọn ghế
    │   │   ├── MyBooking.jsx        # Quản lý đặt chỗ
    │   │   ├── MyTickets.jsx        # Vé điện tử
    │   │   ├── Fav.jsx              # Phim yêu thích
    │   │   ├── Login.jsx            # Đăng nhập
    │   │   └── admin/
    │   │       ├── Layout.jsx       # Layout admin
    │   │       ├── Dashboard.jsx    # Bảng thống kê
    │   │       ├── AddShows.jsx     # Thêm phim & suất chiếu
    │   │       ├── ListShow.jsx     # Danh sách suất chiếu
    │   │       └── ListBookings.jsx # Danh sách đặt chỗ
    │   ├── contexts/
    │   │   ├── AuthContext.jsx      # Provider xác thực
    │   │   ├── auth-context.js      # Context object
    │   │   └── useAuth.js           # Custom hook useAuth
    │   ├── services/
    │   │   ├── index.js             # Export service
    │   │   ├── mockService.js       # Toàn bộ nghiệp vụ & dữ liệu
    │   │   └── imageStorage.js      # Lưu ảnh IndexedDB
    │   ├── lib/
    │   │   ├── dateFormat.js        # Định dạng ngày tháng
    │   │   ├── timeFormat.js        # Định dạng thời lượng phim
    │   │   ├── isoTimeFormat.js     # Định dạng ISO time
    │   │   └── kConverter.js        # Định dạng số (K, M)
    │   ├── App.jsx                  # Cấu hình routes chính
    │   ├── main.jsx                 # Entry point
    │   └── index.css                # CSS toàn cục
    ├── index.html                   # HTML entry
    ├── vite.config.js               # Cấu hình Vite
    ├── vercel.json                  # Cấu hình deploy Vercel
    ├── package.json                 # Dependencies & scripts
    └── .env                         # Biến môi trường
```

### 5.2.2. Mô tả chức năng các thư mục chính

#### 1. `src/components/`

- Chứa các UI component tái sử dụng được dùng ở nhiều trang.
- `BookingPaymentPanel` xử lý toàn bộ UI thanh toán (chọn phương thức, nhập SĐT/địa chỉ).
- `ProtectedRoute` bảo vệ các trang yêu cầu đăng nhập/phân quyền.

#### 2. `src/pages/`

- Mỗi file tương ứng một Route trong ứng dụng.
- `SeatLayout.jsx` là trang phức tạp nhất: render sơ đồ 90 ghế, xử lý chọn ghế, tích hợp giảm giá thứ Tư.
- `AddShows.jsx` (admin) là form phức tạp nhất: hỗ trợ thêm phim mới hoặc chọn phim cũ, upload ảnh.

#### 3. `src/services/mockService.js`

- Đóng vai trò **backend giả lập** hoàn chỉnh cho phiên bản demo.
- Mọi dữ liệu được đồng bộ vào `localStorage`, đảm bảo persist qua các lần reload.
- `imageStorage.js` giải quyết giới hạn kích thước localStorage bằng cách lưu ảnh base64 vào IndexedDB.

#### 4. `src/contexts/`

- `AuthContext` cung cấp trạng thái đăng nhập toàn ứng dụng.
- `useAuth` custom hook giúp các component con truy cập dễ dàng.
- Trạng thái được persist vào `localStorage` với key `quickshow_current_user`.

#### 5. `src/lib/`

- Tách biệt các hàm tiện ích thuần túy khỏi component.
- `timeFormat.js` chuyển phút → "Xh Ym" (ví dụ: 148 → "2h 28m").
- `dateFormat.js` định dạng ISO date → ngày tháng thân thiện.

---

## 5.3. Hướng dẫn cài đặt và chạy

### Bước 1: Cài đặt môi trường

```bash
# Yêu cầu Node.js >= 18
node --version
npm --version
```

### Bước 2: Cài đặt thư viện

```bash
cd client
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `client/.env`:

```env
VITE_CURRENCY=$
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Customer | customer@test.com | password |
| Admin | admin@test.com | password |

---

# Phần 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 6.1. Kết luận

Sau thời gian nghiên cứu và thực hiện đồ án Project II với đề tài **"Hệ thống đặt vé xem phim trực tuyến – QuickShow"**, các nhiệm vụ và mục tiêu đề ra ban đầu cơ bản đã hoàn thành:

### 1. Về mặt nghiệp vụ:

- Nắm vững quy trình đặt vé xem phim từ khâu duyệt phim, chọn ghế đến thanh toán và quản lý vé.
- Giải quyết bài toán đặc thù về quản lý trạng thái ghế ngồi và chính sách ưu đãi tự động (giảm giá 30% ngày thứ Tư).
- Hỗ trợ hai hình thức thanh toán: online (xác nhận ngay) và trực tiếp (chờ giao vé).

### 2. Về mặt phân tích thiết kế:

- Hoàn thiện bộ hồ sơ thiết kế hệ thống theo chuẩn OOAD với mô tả Use Case, Activity Diagram, State Machine, Class Diagram và Routing Design.
- Thiết kế cấu trúc dữ liệu hợp lý với đầy đủ ràng buộc, đảm bảo tính nhất quán và toàn vẹn dữ liệu trong phạm vi client-side storage.

### 3. Về mặt cài đặt thực nghiệm:

- Xây dựng thành công phiên bản Front-end demo hoàn chỉnh bằng React 19, Vite 7 và TailwindCSS v4.
- Triển khai đầy đủ các tính năng cốt lõi:
  - Sơ đồ ghế tương tác 90 vị trí (10 hàng × 9 ghế).
  - Tự động tính giá vé với giảm giá thứ Tư.
  - Đặt chỗ và thanh toán hai phương thức.
  - Phân quyền Customer / Admin với Protected Routes.
  - Admin Dashboard thống kê doanh thu và quản lý phim/suất chiếu.
- Xử lý lưu trữ ảnh thông minh: dùng IndexedDB cho ảnh base64 để tránh giới hạn localStorage.

Dù đạt được những kết quả khả quan, hệ thống vẫn còn một số hạn chế: chưa có Backend thực tế, dữ liệu chỉ lưu tại máy khách và chưa tích hợp cổng thanh toán thật.

---

## 6.2. Hướng phát triển

### 1) Hoàn thiện kiến trúc phần mềm:

- Xây dựng hệ thống Backend hoàn chỉnh sử dụng **Node.js (Express)** hoặc **Java (Spring Boot)** để quản lý dữ liệu tập trung, thay thế mock service hiện tại.
- Tích hợp cơ sở dữ liệu quan hệ (**PostgreSQL** hoặc **MySQL**) để lưu trữ lâu dài và hỗ trợ đa người dùng.
- Triển khai kiến trúc RESTful API hoặc GraphQL giữa Frontend và Backend.

### 2) Nâng cấp công nghệ và tính năng:

- Sử dụng **WebSockets (Socket.io)** để cập nhật trạng thái ghế theo thời gian thực khi nhiều khách hàng truy cập cùng lúc.
- Tích hợp các cổng thanh toán thực tế tại Việt Nam:
  - **VNPAY**
  - **MoMo**
  - **ZaloPay**  
  thông qua môi trường Sandbox.
- Phát triển tính năng **vé QR Code** để khách hàng check-in tại rạp không cần vé giấy.
- Thêm tính năng **tìm kiếm và lọc phim** theo thể loại, ngôn ngữ, thời gian chiếu.
- Tích hợp **TMDB API** để tự động lấy thông tin phim thay vì nhập thủ công.

### 3) Nâng cao trải nghiệm người dùng:

- Phát triển ứng dụng di động (React Native hoặc Flutter) để đặt vé trên điện thoại.
- Thêm tính năng **gợi ý phim** (Recommendation System) dựa trên lịch sử xem và yêu thích.
- Tích hợp hệ thống **đánh giá và bình luận** phim sau khi xem.
- Hỗ trợ **đa ngôn ngữ** (Tiếng Việt / Tiếng Anh).

### 4) Triển khai và vận hành:

- Triển khai Frontend lên **Vercel** (đã cấu hình `vercel.json`).
- Triển khai Backend lên **Railway**, **Render** hoặc **AWS**.
- Thiết lập **CI/CD pipeline** với GitHub Actions để tự động kiểm tra và deploy.

---

# TÀI LIỆU THAM KHẢO

[1] Vite contributors, *"Vite - Next Generation Frontend Tooling,"* Vitejs.dev, 2026. [Online].  
Available: <https://vitejs.dev>.

[2] Meta Platforms, Inc., *"React 19 - The library for web and native user interfaces,"* React.dev, 2026. [Online].  
Available: <https://react.dev>.

[3] Tailwind Labs Inc., *"Tailwind CSS v4 - Rapidly build modern websites,"* Tailwindcss.com, 2026. [Online].  
Available: <https://tailwindcss.com/docs>.

[4] Lucide contributors, *"Lucide React - Beautiful & consistent icons,"* Lucide.dev, 2026. [Online].  
Available: <https://lucide.dev>.

[5] Remix Software, Inc., *"React Router v7 - Declarative routing for React,"* Reactrouter.com, 2026. [Online].  
Available: <https://reactrouter.com>.

[6] React Hot Toast contributors, *"React Hot Toast - Smoking hot Notifications,"* React-hot-toast.com, 2026. [Online].  
Available: <https://react-hot-toast.com>.

[7] CookPete, *"React Player - A React component for playing a variety of URLs,"* GitHub.com, 2026. [Online].  
Available: <https://github.com/CookPete/react-player>.

[8] MDN contributors, *"MDN Web Docs - Web Storage API,"* Developer.mozilla.org, 2026. [Online].  
Available: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API>.

[9] MDN contributors, *"MDN Web Docs - IndexedDB API,"* Developer.mozilla.org, 2026. [Online].  
Available: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>.

[10] Vercel Inc., *"Vercel - Develop, Preview, Ship,"* Vercel.com, 2026. [Online].  
Available: <https://vercel.com>.
