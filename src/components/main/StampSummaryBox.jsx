const stamps = [
  { emoji: "😊", label: "기쁨" },
  { emoji: "😢", label: "슬픔" },
  { emoji: "😠", label: "분노" },
  { emoji: "😨", label: "두려움" },
  { emoji: "😮", label: "놀람" },
  { emoji: "🤢", label: "혐오" },
  { emoji: "😐", label: "중립" },
];

function StampSummaryBox() {
  return (
    <section className="stamp-book-card">
      <div className="section-heading">
        <span className="section-icon">💟</span>
        <h2>이번 달 감정 스탬프북</h2>
      </div>

      <div className="stamp-grid">
        {stamps.map((stamp) => (
          <article className="stamp-item" key={stamp.label}>
            <div className="stamp-emoji">{stamp.emoji}</div>
            <p>감정 스탬프</p>
            <strong>{stamp.label}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StampSummaryBox;
