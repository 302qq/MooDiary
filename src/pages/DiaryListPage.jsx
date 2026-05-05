import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/* 🔹 더미 데이터 (삭제 불가) */
const mockDiaries = [
  {
    id: 1,
    title: "오늘은 기쁜 하루였다...",
    date: "2026-05-05",
    content: "오늘은 생각보다s 기분 좋은 일이 많았다.",
    ai: "기쁜 순간을 잘 기억해둔 멋진 하루였어요.",
  },
];

function DiaryListPage() {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedDate = params.get("date");

  /*  localStorage 불러오기 */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries")) || [];
    setDiaries([...saved, ...mockDiaries]);
  }, []);

  /*  날짜 필터 */
  const filteredDiaries = selectedDate
    ? diaries.filter((d) => d.date === selectedDate)
    : diaries;

  /*  자동 선택 */
  useEffect(() => {
    if (filteredDiaries.length > 0) {
      setSelectedDiary(filteredDiaries[0]);
    } else {
      setSelectedDiary(null);
    }
  }, [selectedDate, diaries]);

  /*  삭제 함수 */
  const handleDelete = () => {
    if (!selectedDiary) return;

    const confirmDelete = window.confirm("이 일기를 삭제할까요?");
    if (!confirmDelete) return;

    //  localStorage에 있는 데이터만 삭제
    const saved = JSON.parse(localStorage.getItem("diaries")) || [];

    const updated = saved.filter((d) => d.id !== selectedDiary.id);

    localStorage.setItem("diaries", JSON.stringify(updated));
    window.dispatchEvent(new Event("diariesUpdated"));

    //  화면 갱신
    setDiaries([...updated, ...mockDiaries]);
    setSelectedDiary(null);
  };

  return (
    <div className="diary-view-page">
      <div className="diary-view-title">
        일기 목록({filteredDiaries.length}편)
      </div>

      <div className="diary-view-layout">
        {/* 왼쪽 리스트 */}
        <div className="diary-view-list">
          {filteredDiaries.length === 0 ? (
            <div className="diary-view-empty">
              해당 날짜의 일기가 없습니다.
            </div>
          ) : (
            filteredDiaries.map((diary) => (
              <div
                key={diary.id}
                className={`diary-view-item ${
                  selectedDiary?.id === diary.id ? "selected" : ""
                }`}
                onClick={() => setSelectedDiary(diary)}
              >
                <p>{diary.title}</p>
                <span>{diary.date}</span>
              </div>
            ))
          )}
        </div>

        {/* 오른쪽 상세 */}
        <div className="diary-view-detail">
          {!selectedDiary ? (
            <p className="empty-detail-text">
              왼쪽에서 일기를 선택해주세요
            </p>
          ) : (
            <div className="detail-inner">
              <div className="detail-date">{selectedDiary.date}</div>

              <div className="detail-title">
                {selectedDiary.title}
              </div>

              <div className="detail-content">
                {selectedDiary.content}
              </div>

              <div className="detail-ai-box">
                <div className="ai-avatar">👻</div>
                <div className="ai-comment-box">
                  {selectedDiary.ai}
                </div>
              </div>

              {/*  삭제 버튼 */}
              <button
                onClick={handleDelete}
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#e81123",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiaryListPage;