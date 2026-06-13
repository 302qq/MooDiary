import { EMOTION_STAMPS } from "../../services/aiDiaryService";

const stamps = Object.values(EMOTION_STAMPS);

function StampSummaryBox() {
  return (
    <section className="stamp-book-card">
      <div className="section-heading">
        <span className="section-icon">🏷</span>
        <h2>이번 달 감정 스탬프</h2>
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
