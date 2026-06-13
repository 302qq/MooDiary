import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LOGIN_STORAGE_KEYS = ["accessToken", "refreshToken", "userId", "nickname"];

function TitleBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const isHomePage = location.pathname === "/";
  const shouldConfirmLogout = isLoggedIn && isHomePage;

  const handleCloseClick = () => {
    if (shouldConfirmLogout) {
      setShowLogoutConfirm(true);
      return;
    }

    navigate("/");
  };

  const handleLogoutConfirm = () => {
    LOGIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <div className="title-bar">
        <span className="title-bar-text">♡ MooDiary | diary.me</span>

        <div className="window-buttons">
          <button type="button">_</button>
          <button type="button">□</button>
          <button type="button" className="close-btn" onClick={handleCloseClick}>
            X
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" role="presentation">
          <div
            className="logout-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <p id="logout-confirm-title" className="logout-confirm-message">
              로그아웃 하시겠습니까?
            </p>

            <div className="logout-confirm-actions">
              <button type="button" onClick={handleLogoutConfirm}>
                확인
              </button>
              <button type="button" onClick={() => setShowLogoutConfirm(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TitleBar;
