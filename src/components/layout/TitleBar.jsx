import { useNavigate } from "react-router-dom";

function TitleBar() {
  const navigate = useNavigate();

  return (
    <div className="title-bar">
      <span className="title-bar-text">♡ MooDiary | diary.me</span>

      <div className="window-buttons">
        <button type="button">_</button>
        <button type="button">□</button>
        <button
          type="button"
          className="close-btn"
          onClick={() => navigate("/")}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
