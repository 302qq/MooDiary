import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MiniCalendar() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [diaryMap, setDiaryMap] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchCalendar = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const response = await fetch(
        `http://15.165.95.129:8080/calendar?year=${year}&month=${month + 1}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("미니 캘린더 조회 상태코드:", response.status);

      if (!response.ok) {
        throw new Error("미니 캘린더 조회 실패");
      }

      const data = await response.json();
      console.log("미니 캘린더 응답:", data);

      const map = {};

      data.forEach((item) => {
        map[item.date] = {
          emoji: item.emoji || "📝",
          postId: item.postId,
        };
      });

      setDiaryMap(map);
    } catch (error) {
      console.error("미니 캘린더 조회 실패:", error);
      setDiaryMap({});
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [year, month]);

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

  const handleDateClick = (day) => {
    if (!day) return;

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const diary = diaryMap[date];

    if (!diary) return;

    navigate(`/diaries?postId=${diary.postId}`);
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

      <div className="mini-calendar-grid">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="mini-calendar-label">
            {day}
          </div>
        ))}

        {getCalendarDays().map((day, index) => {
          const date = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`
            : "";

          const diary = diaryMap[date];
          const stamp = diary?.emoji;

          return (
            <div
              key={index}
              className={`mini-calendar-cell ${stamp ? "active" : ""}`}
              onClick={() => handleDateClick(day)}
              style={{
                cursor: stamp ? "pointer" : "default",
              }}
            >
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