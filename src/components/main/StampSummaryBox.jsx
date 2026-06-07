const stamps = [
  { emoji: "😊", label: "가장 많은 감정", value: "기쁨 12회" },
  { emoji: "🥰", label: "행복 지수", value: "85%" },
  { emoji: "🥳", label: "가장 뿌듯한 감정", value: "뿌듯 8회" },
  { emoji: "🥺", label: "위로가 필요한 감정", value: "슬픔 3회" },
  { emoji: "😴", label: "조금 느낀 감정", value: "피곤 5회" },
  { emoji: "🤩", label: "가장 기대한 감정", value: "기대 4회" },
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
            <p>{stamp.label}</p>
            <strong>{stamp.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StampSummaryBox;
