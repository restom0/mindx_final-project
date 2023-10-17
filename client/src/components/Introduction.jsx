import "../css/Introduction.css";

const Introduction = ({ theme }) => {
  return (
    <div className="Page-Welcome" id={theme} style={{ width: "508.28px" }}>
      <h1 id={theme} className="Page-Welcome--H1">
        Một công cụ đếm giờ hoàn hảo giúp tăng năng suất làm việc
      </h1>
      <h2 id={theme} className="Page-Welcome--H2">
        Pomofocus là gì?
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        Pomofocus là một bộ đếm thời gian trực tuyến, được thiết kế để chạy được
        trên cả máy tính và trình duyệt di động. Mục đích của phần mềm này là
        muốn giúp bạn có thể tập trung vào bất kì công việc gì mà bạn đang thực
        hiện, ví dụ như học tập, viết lách, hoặc lập trình. Phần mềm được lấy
        cảm hứng từ{" "}
        <a
          href="https://francescocirillo.com/products/the-pomodoro-technique"
          target="blank"
        >
          Pomodoro Technique
        </a>{" "}
        (Kỹ thuật Pomodoro), một phương pháp quản lý thời gian được phát minh
        bởi Francesco Cirillo.
      </h4>
      <h2 id={theme} className="Page-Welcome--H2">
        Kỹ thuật Pomodoro là gì?
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        Kỹ thuật Pomodoro được tạo ra bởi Francesco Cirillo nhằm mang lại nhiều
        hiệu quả hơn trong công việc và học tập. Kỹ thuật này sử dụng một bộ đếm
        thời gian để chia nhỏ công việc ra thành từng phần nhỏ hơn, thường là
        với độ dài khoảng 25 phút mỗi phần, cách nhau bằng những khoảng thời
        gian nghỉ ngắn. Mỗi phần đó được gọi là một Pomodoro, bắt nguồn từ một
        từ tiếng Ý, có nghĩa là 'tomato' (cà chua), được đặt theo tên một chiếc
        đồng hồ hẹn giờ trong bếp có hình quả cà chua mà Cirillo từng sử dụng
        khi còn là sinh viên đại học. -{" "}
        <a
          href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
          target="blank"
        >
          Wikipedia
        </a>
      </h4>
      <h2 id={theme} className="Page-Welcome--H2">
        Làm sao để sử dụng bộ đếm giờ Pomodoro?
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        <ol id={theme} className="OL">
          <li>
            <strong>Thêm công việc</strong> sẽ thực hiện vào hôm nay.
          </li>
          <li>
            <strong>Cài đặt ước tính số "Pomodoros"</strong> (1 Pomodoro tương
            đương 25 phút làm việc) cho mỗi công việc.
          </li>
          <li>
            <strong>Chọn một công việc</strong> để thực hiện.
          </li>
          <li>
            <strong>Khởi chạy bộ đếm</strong> và tập trung làm việc trong 25
            phút.
          </li>
          <li>
            <strong>Nghỉ ngơi</strong> trong vòng 5 phút sau khi chuông reo.
          </li>
          <li>
            <strong>Lặp lại</strong> 3-5 lần như vậy cho tới khi hoàn thành công
            việc.
          </li>
        </ol>
      </h4>
      <h2 id={theme} className="Page-Welcome--H2">
        Các tính năng cơ bản
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        <ul id={theme} className="UL">
          <li>
            <strong>Ước tính thời gian hoàn thành</strong>: Nhận một dự tính
            thời gian cần thiết để hoàn thành công việc hằng ngày.
          </li>
          <li>
            <strong>Thêm nhanh mẫu</strong>: Lưu lại các công việc thường xuyên
            phải thực hiện và thêm chúng nhanh chóng chỉ với một nút bấm.
          </li>
          <li>
            <strong>Báo cáo trực quan</strong>: Hiển thị thời gian bạn đã làm
            việc theo ngày, tuần và tháng.
          </li>
          <li>
            <strong>Thiết lập tùy chỉnh</strong>: Thiết lập thời gian tập trung
            / thời gian nghỉ, kiểu chuông, âm thanh nền, ... tùy theo ý của
            người dùng.
          </li>
        </ul>
      </h4>
      <h2 id={theme} className="Page-Welcome--H2">
        Tính năng nâng cao
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        <ul id={theme} className="UL">
          <li>
            <strong>Thêm dự án mới</strong>: Theo dõi khoảng thời gian bạn dành
            cho mỗi dự án.
          </li>
          <li>
            <strong>Báo cáo hàng năm</strong>: Hiển thị thời gian mà bạn đã làm
            việc hàng năm.
          </li>
          <li>
            <strong>Tải xuống báo cáo</strong>: Cho phép bạn tải xuống lịch sử
            làm việc dưới dạng CSV.
          </li>
          <li>
            <strong>Không giới hạn số mẫu</strong>: Có thể lưu trữ số lượng mẫu
            không giới hạn.
          </li>
          <li>
            <strong>Tích hợp Todoist</strong>: Tải lên các công việc từ tài
            khoản Todoist của bạn.
          </li>
          <li>
            <strong>Tích hợp Webhook</strong>: Cho phép kết nối tới các ứng dụng
            ngoài (Zapier, IFTTT,...).
          </li>
          <li>
            <strong>Không có quảng cáo</strong>: Tận hưởng trải nghiệm ứng dụng
            một cách hoàn hảo.
          </li>
        </ul>
      </h4>
      <h2 id={theme} className="Page-Welcome--H2">
        Tải xuống
      </h2>
      <h4 id={theme} className="Page-Welcome--H4">
        <ul id={theme} className="UL">
          <li>
            {" "}
            <a href="/downloadable/pomofocus-darwin-x64-1.1.0.zip" download>
              Hệ máy macOS
            </a>{" "}
            (zip file)
          </li>
          <li>
            <a href="/downloadable/pomofocus-1.1.0-setup.zip" download>
              Hệ máy Windows
            </a>{" "}
            (zip file)
          </li>
        </ul>
      </h4>
    </div>
  );
};

export default Introduction;
