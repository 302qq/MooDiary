const week = [
  { day: "월", date: 12, emoji: "😢" },
  { day: "화", date: 13, emoji: "☺️" },
  { day: "수", date: 15, emoji: "😀" },
  { day: "목", date: 16, emoji: "☺️" },
  { day: "금", date: 17, emoji: "😡" },
  { day: "토", date: 18, emoji: "😀" },
  { day: "일", date: 19, emoji: "😀" },
];

function WeeklyStampBox() {
  return (
    <section className="weekly-box">
      <h3>이번 주 감정스탬프(ai 분석 준비중)</h3>

      <div className="week-row week-labels">
        {week.map((item) => (
          <span key={item.day}>{item.day}</span>
        ))}
      </div>

      <div className="week-row week-dates">
        {week.map((item) => (
          <span key={item.date}>{item.date}</span>
        ))}
      </div>

      <div className="week-row week-emojis">
        {week.map((item, index) => (
          <span key={index}>{item.emoji}</span>
        ))}
      </div>
    </section>
  );
}

export default WeeklyStampBox;