import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmotionStamp } from "../services/aiDiaryService";

const EMPHASIS_SECTIONS = ["당신에게 전해줄 말", "도움이 될 만한 활동"];

const parseAiTextSections = (aiText) => {
  if (!aiText) return [];

  const sectionPattern =
    /(?:^|\n)\s*(?:\[(심리 해석|당신에게 전해줄 말)\]|💡\s*(도움이 될 만한 활동))\s*:?\s*/g;
  const matches = [...aiText.matchAll(sectionPattern)];

  if (matches.length === 0) {
    return [{ title: "AI 분석", content: aiText.trim() }];
  }

  return matches
    .map((match, index) => {
      const title = match[1] || match[2] || "AI 분석";
      const start = match.index + match[0].length;
      const end =
        index + 1 < matches.length ? matches[index + 1].index : aiText.length;

      return {
        title,
        content: aiText.slice(start, end).trim(),
      };
    })
    .filter((section) => section.content);
};

function AIResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const aiResult = location.state?.aiResult || null;
  const emotionStamp = getEmotionStamp(aiResult?.emotion);
  const aiSections = parseAiTextSections(aiResult?.aiText || "");

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

          <section className="ai-result-summary ai-result-pink-divider">
            <h3>AI 한마디</h3>
            <p>{aiResult.homeComment || "AI가 오늘의 마음을 정리했어요."}</p>
          </section>

          <div className="ai-result-body">
            {aiSections.length === 0 ? (
              <section className="ai-result-text-section">
                <h3>AI 분석</h3>
                <p>AI 분석 문장이 없습니다.</p>
              </section>
            ) : (
              aiSections.map((section) => (
                <section
                  className={
                    "ai-result-text-section" +
                    (EMPHASIS_SECTIONS.includes(section.title)
                      ? " ai-result-section-card"
                      : "")
                  }
                  key={section.title}
                >
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </section>
              ))
            )}
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
