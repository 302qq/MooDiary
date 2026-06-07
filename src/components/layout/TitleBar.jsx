function TitleBar() {
  return (
    <div className="title-bar">
      <span className="title-bar-text">♡ MooDiary | diary.me</span>

      <div className="window-buttons">
        <button type="button">−</button>
        <button type="button">□</button>
        <button type="button" className="close-btn">
          ×
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
