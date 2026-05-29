import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WriteDiaryPage() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2026-05-16");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiComment, setAiComment] = useState("");

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://15.165.95.129:8080/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      console.log("게시글 저장 상태코드:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("게시글 저장 실패 응답:", errorText);
        throw new Error("게시글 저장 API 요청 실패");
      }

      const postId = await response.text();
      console.log("생성된 게시글 ID:", postId);

      const newDiary = {
        id: postId || Date.now(),
        date: selectedDate,
        title,
        content,
        ai: "오늘 하루도 잘 견뎌냈어요. 잠깐 쉬어가도 괜찮아요.",
      };

      const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
      const updatedDiaries = [newDiary, ...savedDiaries];

      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
      window.dispatchEvent(new Event("diariesUpdated"));

      setAiComment(newDiary.ai);

      alert("일기가 저장되었습니다.");
      navigate("/diaries");
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      alert("서버 저장에 실패했습니다. 로그인 상태 또는 백엔드 서버를 확인해주세요.");
    }
  };

  return (
    <div className="write-wrapper">
      <div className="write-page-title">오늘의 일기</div>

      <div className="date-area">
        <input
          className="write-date-button"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <input
        className="write-input-title"
        type="text"
        placeholder="오늘의 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="write-textarea"
        placeholder="오늘 하루는 어땠나요? 자유롭게 적어보세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="write-button-area">
        <button type="button" className="write-submit" onClick={handlePublish}>
          발행하기
        </button>
      </div>

      <div className="ai-comment-area">
        <div className="ai-avatar">👻</div>
        <div className="ai-comment-box">
          {aiComment || "AI의 한 마디..."}
        </div>
      </div>
    </div>
  );
}

export default WriteDiaryPage;