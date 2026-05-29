const stamps = [
  { emoji: "😢", label: "슬픔", count: 5 },
  { emoji: "😡", label: "화남", count: 5 },
  { emoji: "😀", label: "기쁨", count: 5 },
  { emoji: "☺️", label: "뿌듯", count: 5 },
  { emoji: "😴", label: "피곤", count: 5 },
];

function StampSummaryBox() {
  return (
    <section className="stamp-box">
      <h3>이번 달 감정스탬프 요약(ai 분석 준비중)</h3>

      <div className="stamp-row">
        {stamps.map((stamp) => (
          <div className="stamp-item" key={stamp.label}>
            <div className="stamp-emoji">{stamp.emoji}</div>
            <p>{stamp.label}</p>
            <strong>{stamp.count}개</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StampSummaryBox;