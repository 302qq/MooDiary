import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDiaryAiResultByDiary,
  getDiaryAiResult,
  getLatestDiaryAiResult,
} from "../../services/aiDiaryService";
import { getDiaryDisplayDate } from "../../utils/diaryDisplay";

const POST_LIST_API_URL = import.meta.env.DEV
  ? "http://15.165.95.129:8080/post?sort=postDate,desc"
  : "/api/post?sort=postDate,desc";

function RecentDiaryBox() {
  const navigate = useNavigate();
  const [recentDiaries, setRecentDiaries] = useState([]);

  useEffect(() => {
    const fetchRecentDiaries = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setRecentDiaries([]);
        return;
      }

      try {
        const response = await fetch(POST_LIST_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("최근 일기 조회 상태코드:", response.status);

        if (!response.ok) {
          throw new Error("최근 일기 조회 실패");
        }

        const data = await response.json();
        console.log("최근 일기 응답:", data);

        const diaries = data.map((post) => {
          const cachedAiResult =
            getDiaryAiResult(post.id) ||
            getDiaryAiResultByDiary({
              title: post.title,
              content: post.content,
            });

          return {
            id: post.id,
            title: post.title,
            date: getDiaryDisplayDate(post, cachedAiResult),
            content: post.content,
            ai:
              cachedAiResult?.homeComment ||
              post.homeComment ||
              post.ai ||
              "",
            homeComment:
              cachedAiResult?.homeComment || post.homeComment || "",
          };
        });

        setRecentDiaries(diaries.slice(0, 5));
      } catch (error) {
        console.error("최근 일기 조회 실패:", error);
        setRecentDiaries([]);
      }
    };

    fetchRecentDiaries();
  }, []);

  const latestAiResult = getLatestDiaryAiResult();
  const todayComment =
    recentDiaries.find((diary) => diary.homeComment)?.homeComment ||
    latestAiResult?.homeComment ||
    recentDiaries.find((diary) => diary.ai)?.ai ||
    "오늘의 감정을 천천히 기록해보세요. 최근 일기의 AI 한마디가 이곳에 표시됩니다.";

  return (
    <>
      <article className="today-message-card">
        <div className="section-heading">
          <span className="section-icon">💌</span>
          <h2>오늘의 한마디</h2>
        </div>

        <p className="today-message-quote">“{todayComment}”</p>
      </article>

      <article className="recent-diary-box">
        <div className="section-heading section-heading-line">
          <span className="section-icon">📒</span>
          <h2>최근 일기</h2>
        </div>

        <div className="recent-list">
          {recentDiaries.length === 0 ? (
            <div className="diary-item diary-empty">
              <p>아직 작성한 일기가 없어요.</p>
              <span>첫 일기를 남기면 이곳에 보여요.</span>
            </div>
          ) : (
            recentDiaries.map((diary) => (
              <button
                className="diary-item"
                key={diary.id}
                type="button"
                onClick={() => navigate(`/diaries?postId=${diary.id}`)}
              >
                <div className="diary-item-top">
                  <strong>{diary.date}</strong>
                  <span className="diary-chip">기록</span>
                </div>
                <p>{diary.title}</p>
                <span className="diary-preview">
                  {diary.content || "내용이 없는 일기입니다."}
                </span>
              </button>
            ))
          )}
        </div>

        <button
          className="view-all-link"
          type="button"
          onClick={() => navigate("/diaries")}
        >
          전체 일기 목록 보기
        </button>
      </article>
    </>
  );
}

export default RecentDiaryBox;
