# Ứng dụng Quản lý Công việc Thời gian thực

Dự án Trello Clone thu nhỏ với tính năng kéo thả mượt mà và đồng bộ hóa thời gian thực đa người dùng qua WebSockets.

## 🚀 Chạy Demo Trực Tiếp

### Khởi chạy môi trường Ảo bằng GitHub Codespaces
Chỉ với 1 click, GitHub sẽ máy tính ảo và setup sẵn NodeJS, tự động mở web cho bạn đánh giá:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/LeQuangViet2003/Ung-Dung-Quan-Ly-Cong-Viec-Thoi-Gian-Thuc)

*Dự án sẽ tự chạy tiến trình chạy máy chủ (Backend cổng 3001) và máy khách (Frontend cổng 5173). Dữ liệu thẻ mặc định sẽ được nạp tự động vào Prisma SQLite.*

### Triển khai Lên Mạng Sinh Viên (Render.com)
Dự án có thể đẩy lên 1 cụm máy chủ NodeJS thông thường trên dịch vụ miễn phí như Render:
- Build URL (Root): `npm run setup && npm run build`
- Start URL: `npm run seed && npm start`
(Dữ liệu Frontend Vite đã được đóng gói thành file tĩnh và được trả về thông qua Backend API port chung).

## 🛠 Kỹ thuật & Công Nghệ
- **Giao diện:** ReactJS, Tailwind
- **Backend Thực thi:** ExpressJS
- **Real-time Engine:** Socket.io
- **Cơ sở dữ liệu:** SQLite thông qua Prisma ORM
