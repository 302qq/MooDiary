function TitleBar() {
  return (
    <div className="title-bar">
      <span>테스트 유저의 미니 홈피</span>

      <div className="window-buttons">
        <button type="button">-</button>
        <button type="button">□</button>
        <button type="button" className="close-btn">
          X
        </button>
      </div>
    </div>
  );
}

export default TitleBar;