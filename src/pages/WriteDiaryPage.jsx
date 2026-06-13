import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatDiaryDateForAi,
  requestDiaryAi,
  saveDiaryAiResult,
} from "../services/aiDiaryService";
import AppModal from "../components/common/AppModal";

const POST_API_URL = import.meta.env.DEV
  ? "http://15.165.95.129:8080/post"
  : "/api/post";

function WriteDiaryPage() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2026-05-16");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [successModal, setSuccessModal] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (isPublishing) return;

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

    setIsPublishing(true);

    try {
      const postPayload = {
        title: title,
        content: content,
      };

      if (selectedDate) {
        postPayload.postDate = selectedDate;
      }

      const response = await fetch(POST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postPayload),
      });

      if (!response.ok) {
        throw new Error("게시글 등록 API 요청 실패");
      }

      const postId = (await response.text()).trim();
      const diaryId = postId || String(Date.now());

      let aiResult = null;
      const diaryDateForAi = formatDiaryDateForAi(selectedDate);

      try {
        aiResult = await requestDiaryAi({
          userText: content,
          diaryDate: diaryDateForAi,
        });
        aiResult = {
          ...aiResult,
          diaryTitle: title,
          diaryContent: content,
        };
        saveDiaryAiResult(diaryId, aiResult);
      } catch {
      }

      const newDiary = {
        id: diaryId,
        date: selectedDate,
        title,
        content,
        ai: "오늘 하루도 정말 수고했어요. 작은 위로가 되어주길 바라요.",
      };

      const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
      const updatedDiaries = [newDiary, ...savedDiaries];

      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
      window.dispatchEvent(new Event("diariesUpdated"));

      setAiComment(newDiary.ai);

      setSuccessModal({ aiResult });
    } catch {
      alert("서버 등록에 실패했습니다. 로그 상태 또는 백엔드 서버를 확인해주세요.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
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
        <button
          type="button"
          className="write-submit"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? "처리 중..." : "발행하기"}
        </button>
      </div>

      <div className="ai-comment-area">
        <div className="ai-avatar">💗</div>
        <div className="ai-comment-box">{aiComment || "AI 한마디"}</div>
      </div>
      </div>

      {isPublishing && (
        <div className="logout-confirm-overlay" role="presentation">
          <div
            className="logout-confirm-dialog diary-loading-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="diary-loading-title"
          >
            <div className="diary-loading-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p id="diary-loading-title" className="logout-confirm-message">
              AI가 일기를 읽고 있어요...
            </p>
            <div className="diary-loading-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

      {successModal && (
        <AppModal
          message="일기가 등록되었습니다."
          onConfirm={() => {
            const aiResult = successModal.aiResult;
            setSuccessModal(null);
            navigate("/ai-result", {
              state: {
                aiResult,
              },
            });
          }}
        />
      )}
    </>
  );
}

export default WriteDiaryPage;



