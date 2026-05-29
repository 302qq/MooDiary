import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


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

  const fetchDiaries = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://15.165.95.129:8080/post", {
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

      const serverDiaries = data.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.createdAt ? post.createdAt.slice(0, 10) : "날짜 없음",
        content: post.content,
        ai: post.ai || "AI의 한 마디...",
        isMock: false,
      }));

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
  }, [selectedDate, selectedPostId, diaries]);

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
        `http://15.165.95.129:8080/post/${selectedDiary.id}`,
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
        `http://15.165.95.129:8080/post/${selectedDiary.id}`,
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

  return (
    <div className="diary-view-page">
      <div className="diary-view-title">
        일기 목록({filteredDiaries.length}편)
      </div>

      <div className="diary-view-layout">
        <div className="diary-view-list">
          {filteredDiaries.length === 0 ? (
            <div className="diary-view-empty">해당 날짜의 일기가 없습니다.</div>
          ) : (
            filteredDiaries.map((diary) => (
              <div
                key={diary.id}
                className={`diary-view-item ${
                  selectedDiary?.id === diary.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedDiary(diary);
                  setIsEditing(false);
                }}
              >
                <p>{diary.title}</p>
                <span>{diary.date}</span>
              </div>
            ))
          )}
        </div>

        <div className="diary-view-detail">
          {!selectedDiary ? (
            <p className="empty-detail-text">왼쪽에서 일기를 선택해주세요</p>
          ) : (
            <div className="detail-inner">
              <div className="detail-date">{selectedDiary.date}</div>

              {isEditing ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                    }}
                  />

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "160px",
                      padding: "8px",
                    }}
                  />

                  <button onClick={handleUpdate}>저장</button>
                  <button onClick={cancelEdit}>취소</button>
                </>
              ) : (
                <>
                  <div className="detail-title">{selectedDiary.title}</div>

                  <div className="detail-content">{selectedDiary.content}</div>

                  <div className="detail-ai-box">
                    <div className="ai-avatar">👻</div>
                    <div className="ai-comment-box">{selectedDiary.ai}</div>
                  </div>

                  <button onClick={startEdit}>수정</button>

                  <button
                    onClick={handleDelete}
                    style={{
                      marginTop: "12px",
                      marginLeft: "8px",
                      padding: "8px 12px",
                      background: "#e81123",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiaryListPage;