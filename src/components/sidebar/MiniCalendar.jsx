import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryDisplayDate } from "../../utils/diaryDisplay";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const POST_LIST_API_URL = import.meta.env.DEV
  ? "http://15.165.95.129:8080/post?sort=postDate,desc"
  : "/api/post?sort=postDate,desc";

const getDiaryId = (item) =>
  item?.postId ??
  item?.post_id ??
  item?.id ??
  item?.diaryId ??
  item?.diary_id ??
  item?.post?.id ??
  item?.diary?.id ??
  "";

const getDateKey = (value) => {
  if (!value) return "";

  const text = String(value).trim();
  const dateMatch = text.match(/^\d{4}-\d{2}-\d{2}/);

  return dateMatch ? dateMatch[0] : text;
};

const isSameMonth = (date, year, month) =>
  date.startsWith(`${year}-${String(month).padStart(2, "0")}-`);

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
      const response = await fetch(POST_LIST_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("미니 캘린더 조회 실패");
      }

      const data = await response.json();

      const map = {};

      data.forEach((post) => {
        const diaryId = getDiaryId(post);
        const date = getDateKey(getDiaryDisplayDate(post));

        if (!diaryId || !date || !isSameMonth(date, year, month + 1)) return;

        map[date] = {
          diaryId,
        };
      });

      setDiaryMap(map);
    } catch (error) {
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

  const handleDateClick = (day) => {
    if (!day) return;

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (!diaryMap[date]?.diaryId) return;

    navigate(`/diaries?date=${date}`);
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-head">
        <span className="mini-calendar-badge">5월</span>
        <div className="mini-calendar-month">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            ‹
          </button>

          <span>
            {year}.{String(month + 1).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="mini-calendar-grid">
        {DAY_LABELS.map((day) => (
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
          const hasDiary = Boolean(diary?.diaryId);

          return (
            <button
              key={index}
              type="button"
              className={`mini-calendar-cell ${hasDiary ? "active" : ""}`}
              onClick={() => handleDateClick(day)}
              disabled={!day || !hasDiary}
            >
              {day && (
                <div className="mini-date-wrap">
                  <div className="mini-date">{day}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;
