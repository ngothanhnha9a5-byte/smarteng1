# Hướng dẫn triển khai lên GitHub Pages

Để triển khai ứng dụng SmartEng lên GitHub Pages, bạn có 2 cách:

## Cách 1: Sử dụng GitHub Actions (Khuyên dùng)

1. Đẩy mã nguồn lên một repository trên GitHub.
2. Vào phần **Settings** -> **Secrets and variables** -> **Actions**.
3. Thêm một **New repository secret**:
   - Name: `GEMINI_API_KEY`
   - Value: (Khóa API Gemini của bạn)
4. Vào phần **Settings** -> **Pages**.
5. Ở mục **Build and deployment** -> **Source**, chọn **GitHub Actions**.
6. Mỗi khi bạn push code lên nhánh `main`, ứng dụng sẽ tự động được build và deploy.

## Cách 2: Sử dụng lệnh `npm run deploy`

1. Cài đặt package `gh-pages` (đã được cài sẵn trong project này).
2. Chạy lệnh:
   ```bash
   npm run deploy
   ```
3. Lệnh này sẽ build ứng dụng và đẩy thư mục `dist` lên nhánh `gh-pages`.
4. Vào phần **Settings** -> **Pages** trên GitHub và chọn nhánh `gh-pages` làm nguồn.

**Lưu ý:**
- File `vite.config.ts` đã được cấu hình `base: './'` để hỗ trợ chạy trong thư mục con của GitHub Pages.
- Đảm bảo bạn đã cấu hình Firebase Authentication (Authorized Domains) trên Firebase Console để cho phép tên miền `your-username.github.io`.
