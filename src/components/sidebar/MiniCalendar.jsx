import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MiniCalendar() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [diaryMap, setDiaryMap] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const loadDiaries = () => {
    const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];

    const map = {};
    savedDiaries.forEach((diary) => {
      map[diary.date] = diary.stamp || "📝";
    });

    setDiaryMap(map);
  };

  useEffect(() => {
    loadDiaries();

    window.addEventListener("diariesUpdated", loadDiaries);

    return () => {
      window.removeEventListener("diariesUpdated", loadDiaries);
    };
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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-title">스탬프 달력</div>

      <div className="mini-calendar-month">
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

      <div className="mini-calendar-grid" onClick={() => navigate("/stamps")}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="mini-calendar-label">
            {day}
          </div>
        ))}

        {getCalendarDays().map((day, index) => {
          const date = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : "";

          const stamp = diaryMap[date];

          return (
            <div key={index} className="mini-calendar-cell">
              {day && (
                <>
                  <div className="mini-date">{day}</div>
                  <div className="mini-stamp">{stamp}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;