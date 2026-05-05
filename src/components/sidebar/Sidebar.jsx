import { useNavigate } from "react-router-dom";
import MiniCalendar from "./MiniCalendar";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="profile-image">👤</div>
        <p className="profile-name">테스트 사용자</p>
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-menu-item" onClick={() => navigate("/write")}>
          일기 쓰기
        </div>

        <div className="sidebar-menu-item" onClick={() => navigate("/diaries")}>
          일기 보기
        </div>

        <div className="sidebar-menu-item" onClick={() => navigate("/stamps")}>
          스탬프 달력
        </div>
      </nav>

      {/* 🔥 여기만 바뀜 */}
      <MiniCalendar />
    </aside>
  );
}

export default Sidebar;