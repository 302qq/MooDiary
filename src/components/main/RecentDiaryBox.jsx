import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockDiaries = [
  { id: 1, title: "오늘은 기쁜 하루였다...", date: "2026-05-05" },
  { id: 2, title: "오늘은 슬픈 하루였다...", date: "2026-05-06" },
];

function RecentDiaryBox() {
  const navigate = useNavigate();
  const [recentDiaries, setRecentDiaries] = useState([]);

  useEffect(() => {
    const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
    const mergedDiaries = [...savedDiaries, ...mockDiaries];

    setRecentDiaries(mergedDiaries.slice(0, 5));
  }, []);

  return (
    <section className="recent-diary-box">
      <div className="recent-list">
        <h3>최근 일기</h3>

        {recentDiaries.map((diary) => (
          <div
            className="diary-item"
            key={diary.id}
            onClick={() => navigate(`/diaries?date=${diary.date}`)}
          >
            <p>{diary.title}</p>
            <span>{diary.date}</span>
          </div>
        ))}
      </div>

      <div className="play-area" onClick={() => navigate("/write")}>
        <div className="play-triangle"></div>
      </div>
    </section>
  );
}

export default RecentDiaryBox;