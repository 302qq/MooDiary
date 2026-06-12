import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getDiaryAiResultByDiary,
  getDiaryAiResult,
  getEmotionStamp,
} from "../services/aiDiaryService";

const mockDiaries = [];

const POST_LIST_API_URL = import.meta.env.DEV
  ? "http://15.165.95.129:8080/post"
  : "/api/post";

function DiaryListPage() {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedDate = params.get("date");
  const selectedPostId = params.get("postId");
  const routeAiResult = location.state?.aiResult || null;

  const fetchDiaries = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(POST_LIST_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("게시글 목록 조회 상태코드:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("목록 조회 실패 응답:", errorText);
        throw new Error("게시글 목록 조회 실패");
      }

      const data = await response.json();
      console.log("게시글 목록 응답:", data);

      const serverDiaries = data.map((post) => {
        const cachedAiResult =
          String(post.id) === String(selectedPostId) && routeAiResult
            ? routeAiResult
            : getDiaryAiResult(post.id) ||
              getDiaryAiResultByDiary({
                title: post.title,
                content: post.content,
              });

        return {
          id: post.id,
          title: post.title,
          date: post.createdAt ? post.createdAt.slice(0, 10) : "날짜 없음",
          content: post.content,
          ai:
            cachedAiResult?.homeComment ||
            post.homeComment ||
            post.ai ||
            "AI가 건넨 한마디...",
          emotion: cachedAiResult?.emotion || post.emotion || "neutral",
          homeComment: cachedAiResult?.homeComment || post.homeComment || "",
          isMock: false,
        };
      });

      setDiaries(serverDiaries);
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
      setDiaries(mockDiaries);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  const filteredDiaries = selectedDate
    ? diaries.filter((d) => d.date === selectedDate)
    : diaries;

  useEffect(() => {
    if (selectedPostId) {
      const found = diaries.find(
        (d) => String(d.id) === String(selectedPostId)
      );

      setSelectedDiary(found || null);
      setIsEditing(false);
      return;
    }

    if (filteredDiaries.length > 0) {
      setSelectedDiary(filteredDiaries[0]);
      setIsEditing(false);
    } else {
      setSelectedDiary(null);
    }
  }, [selectedDate, selectedPostId, diaries, filteredDiaries]);

  const startEdit = () => {
    if (!selectedDiary) return;

    if (selectedDiary.isMock) {
      alert("더미 데이터는 서버에 없는 글이라 수정할 수 없습니다.");
      return;
    }

    setEditTitle(selectedDiary.title);
    setEditContent(selectedDiary.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = async () => {
    if (!selectedDiary) return;

    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `/api/post/${selectedDiary.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
          }),
        }
      );

      console.log("게시글 수정 상태코드:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("수정 실패 응답:", errorText);
        throw new Error("게시글 수정 실패");
      }

      alert("수정되었습니다.");

      const updatedDiaries = diaries.map((diary) =>
        diary.id === selectedDiary.id
          ? {
              ...diary,
              title: editTitle,
              content: editContent,
            }
          : diary
      );

      setDiaries(updatedDiaries);
      setSelectedDiary({
        ...selectedDiary,
        title: editTitle,
        content: editContent,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedDiary) return;

    if (selectedDiary.isMock) {
      alert("더미 데이터는 서버에 없는 글이라 삭제할 수 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("이 일기를 삭제할까요?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `/api/post/${selectedDiary.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("게시글 삭제 상태코드:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("삭제 실패 응답:", errorText);
        throw new Error("게시글 삭제 실패");
      }

      alert("삭제되었습니다.");

      const updatedDiaries = diaries.filter((d) => d.id !== selectedDiary.id);
      setDiaries(updatedDiaries);
      setSelectedDiary(updatedDiaries[0] || null);
      setIsEditing(false);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const selectedEmotionStamp = selectedDiary
    ? getEmotionStamp(selectedDiary.emotion)
    : null;

  return (
    <div className="diary-view-page">
      <div className="diary-view-title">일기 보기</div>

      <div className="diary-view-layout">
        <section className="diary-view-list-panel">
          <div className="diary-view-list-header">
            <div>
              <h2>일기 목록</h2>
              <p>마음을 적어둔 하루를 다시 펼쳐보세요.</p>
            </div>
            <span className="diary-view-count">{filteredDiaries.length}편</span>
          </div>

          <div className="diary-view-list">
            {filteredDiaries.length === 0 ? (
              <div className="diary-view-empty">
                해당 날짜의 일기가 없습니다.
              </div>
            ) : (
              filteredDiaries.map((diary) => (
                <button
                  key={diary.id}
                  type="button"
                  className={
                    "diary-view-item" +
                    (selectedDiary?.id === diary.id ? " selected" : "")
                  }
                  onClick={() => {
                    setSelectedDiary(diary);
                    setIsEditing(false);
                  }}
                >
                  <strong>{diary.title}</strong>
                  <span>{diary.date}</span>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="diary-view-detail">
          {!selectedDiary ? (
            <p className="empty-detail-text">왼쪽에서 일기를 선택해주세요.</p>
          ) : (
            <div className="detail-inner">
              <div className="detail-meta-row">
                <div className="detail-date">{selectedDiary.date}</div>

                <div className="detail-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="detail-action primary"
                        onClick={handleUpdate}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        className="detail-action secondary"
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="detail-action primary"
                        onClick={startEdit}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="detail-action danger"
                        onClick={handleDelete}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="detail-edit-form">
                  <input
                    className="detail-edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="detail-edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="detail-title">{selectedDiary.title}</div>

                  <section className="detail-panel detail-content-panel">
                    <div className="detail-panel-header">
                      <span className="section-icon">✎</span>
                      <h3>일기 내용</h3>
                    </div>
                    <div className="detail-content">
                      {selectedDiary.content}
                    </div>
                  </section>

                  <section className="detail-panel detail-ai-section">
                    <div className="detail-panel-header">
                      <span className="section-icon">💌</span>
                      <h3>AI 한마디</h3>
                    </div>
                    <div className="detail-ai-box">
                      <div className="ai-avatar">
                        {selectedEmotionStamp.emoji}
                      </div>
                      <div className="ai-comment-box">
                        <div className="ai-emotion-line">
                          감정 스탬프: {selectedEmotionStamp.label}
                        </div>
                        <div>{selectedDiary.ai}</div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DiaryListPage;
