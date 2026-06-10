import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StampCalendarPage() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [diaryMap, setDiaryMap] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const fetchCalendar = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/calendar?year=${year}&month=${month + 1}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("캘린더 조회 상태코드:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.log("캘린더 조회 실패 응답:", errorText);
          throw new Error("캘린더 조회 실패");
        }

        const data = await response.json();
        console.log("캘린더 조회 응답:", data);

        const map = {};

        data.forEach((item) => {
          map[item.date] = {
            emoji: item.emoji || "🫧",
            postId: item.postId,
          };
        });

        setDiaryMap(map);
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
        setDiaryMap({});
      }
    };

    fetchCalendar();
  }, [year, month, navigate]);

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

    const diary = diaryMap[date];

    if (diary) {
      navigate(`/diaries?date=${date}`);
    }
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="calendar-page">
      <div className="calendar-title">스탬프 달력</div>

      <div className="calendar-wrapper">
        <div className="calendar-shell">
          <div className="calendar-headline">
            <div>
              <h2>이번 달 감정 스탬프</h2>
              <p>스탬프가 있는 날짜를 눌러 해당 일기를 확인해보세요.</p>
            </div>
          </div>

          <div className="calendar-header">
            <button type="button" className="calendar-nav-button" onClick={handlePrevMonth}>
              ‹
            </button>

            <span className="calendar-month-label">
              {year}년 {month + 1}월
            </span>

            <button type="button" className="calendar-nav-button" onClick={handleNextMonth}>
              ›
            </button>
          </div>

          <div className="calendar-grid">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
              <div
                key={d}
                className={`calendar-day-label ${idx === 0 ? "sun" : ""} ${
                  idx === 6 ? "sat" : ""
                }`}
              >
                {d}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const date = day
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`
                : "";

              const diary = diaryMap[date];
              const stamp = diary?.emoji;
              const isActive = Boolean(stamp);
              const dayOfWeek = index % 7;

              return (
                <button
                  key={index}
                  type="button"
                  className={`calendar-cell ${
                    isActive ? "active has-stamp" : "inactive"
                  } ${day ? "has-day" : "empty"} ${dayOfWeek === 0 ? "sun" : ""} ${
                    dayOfWeek === 6 ? "sat" : ""
                  }`}
                  onClick={() => handleClick(day)}
                  disabled={!day || !isActive}
                >
                  {day && (
                    <>
                      <div className="date">{day}</div>
                      <div className="emoji">{stamp || "·"}</div>
                      <div className="calendar-cell-note">
                        {isActive ? "일기 보기" : "기록 없음"}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StampCalendarPage;
