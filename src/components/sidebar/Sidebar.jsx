import { useNavigate } from "react-router-dom";
import MiniCalendar from "./MiniCalendar";
import profileImage from "../../assets/profile_imge.jpg";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="profile-frame">
          <div className="profile-image profile-image--photo" aria-hidden="true">
            <img className="profile-photo" src={profileImage} alt="" />
            <div className="profile-portrait">
              <div className="profile-hair" />
              <div className="profile-face">
                <span className="profile-eye left" />
                <span className="profile-eye right" />
                <span className="profile-mouth" />
              </div>
              <div className="profile-neck" />
              <div className="profile-shirt" />
            </div>
          </div>
        </div>
        <p className="profile-name">MooDiary 사용자</p>
        <span className="profile-quote">오늘도 포근한 하루가 되기를</span>
      </div>

            <nav className="sidebar-menu">
        <button
          type="button"
          className="sidebar-menu-item"
          onClick={() => navigate("/write")}
        >
          <span className="sidebar-menu-icon">🖊</span>
          일기 쓰기
        </button>

        <button
          type="button"
          className="sidebar-menu-item"
          onClick={() => navigate("/diaries")}
        >
          <span className="sidebar-menu-icon">📂</span>
          일기 보기
        </button>

        <button
          type="button"
          className="sidebar-menu-item"
          onClick={() => navigate("/stamps")}
        >
          <span className="sidebar-menu-icon">📅</span>
          스탬프 달력
        </button>
      </nav>

      <MiniCalendar />
    </aside>
  );
}

export default Sidebar;
