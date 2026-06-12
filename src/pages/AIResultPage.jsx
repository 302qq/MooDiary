import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmotionStamp } from "../services/aiDiaryService";

function AIResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const aiResult = location.state?.aiResult || null;
  const emotionStamp = getEmotionStamp(aiResult?.emotion);

  useEffect(() => {
    if (!aiResult) {
      navigate("/", { replace: true });
    }
  }, [aiResult, navigate]);

  if (!aiResult) {
    return null;
  }

  return (
    <div className="ai-result-page">
      <div className="ai-result-title">AI 마음 분석</div>

      <div className="ai-result-wrapper">
        <section className="ai-result-card">
          <div className="ai-result-head">
            <div>
              <p className="ai-result-kicker">MooDiary AI</p>
              <h2>{aiResult.diaryDate || "오늘의 일기"}</h2>
            </div>
            <div className="ai-result-stamp">
              <span>{emotionStamp.emoji}</span>
              <strong>{emotionStamp.label}</strong>
            </div>
          </div>

          <div className="ai-result-summary">
            {aiResult.homeComment || "AI가 오늘의 마음을 정리했어요."}
          </div>

          <div className="ai-result-body">
            <h3>AI 한마디</h3>
            <p>{aiResult.aiText || "AI 분석 문장이 없습니다."}</p>
          </div>

          <div className="ai-result-actions">
            <button
              type="button"
              className="detail-action secondary"
              onClick={() => navigate("/")}
            >
              홈으로
            </button>
            <button
              type="button"
              className="detail-action primary"
              onClick={() => navigate("/diaries")}
            >
              일기 보기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AIResultPage;
