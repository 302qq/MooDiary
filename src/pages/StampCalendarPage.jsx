import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockDiaries = [
  { id: 1, date: "2026-05-05", stamp: "😢" },
];

function StampCalendarPage() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [diaryMap, setDiaryMap] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0부터 시작: 4 = 5월

  useEffect(() => {
    const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
    const allDiaries = [...savedDiaries, ...mockDiaries];

    const map = {};
    allDiaries.forEach((diary) => {
      map[diary.date] = diary.stamp || "📝";
    });

    setDiaryMap(map);
  }, []);

 const getCalendarDays = () => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDay).fill("");
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const calendarDays = [...blanks, ...days];

  while (calendarDays.length < 42) {
    calendarDays.push("");
  }

  return calendarDays;
};

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleClick = (day) => {
    if (!day) return;

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (diaryMap[date]) {
      navigate(`/diaries?date=${date}`);
    }
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="calendar-page">
      <div className="calendar-title">스탬프 달력</div>

      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button type="button" onClick={handlePrevMonth}>
            {"<"}
          </button>

          <span>
            {year}년 {month + 1}월
          </span>

          <button type="button" onClick={handleNextMonth}>
            {">"}
          </button>
        </div>

        <div className="calendar-grid">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="calendar-day-label">
              {d}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            const date = day
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`
              : "";

            const stamp = diaryMap[date];

            return (
              <div
                key={index}
                className={`calendar-cell ${stamp ? "active" : ""}`}
                onClick={() => handleClick(day)}
              >
                {day && (
                  <>
                    <div className="date">{day}</div>
                    <div className="emoji">{stamp}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StampCalendarPage;