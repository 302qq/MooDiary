import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        const response = await fetch("http://15.165.95.129:8080/post", {
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

        const diaries = data.map((post) => ({
          id: post.id,
          title: post.title,
          date: post.createdAt
            ? post.createdAt.slice(0, 10)
            : "날짜 없음",
          content: post.content,
        }));

        setRecentDiaries(diaries.slice(0, 5));
      } catch (error) {
        console.error("최근 일기 조회 실패:", error);
        setRecentDiaries([]);
      }
    };

    fetchRecentDiaries();
  }, []);

  return (
    <section className="recent-diary-box">
      <div className="recent-list">
        <h3>최근 일기</h3>

        {recentDiaries.length === 0 ? (
          <div className="diary-item">
            <p>아직 작성된 일기가 없습니다.</p>
            <span>-</span>
          </div>
        ) : (
          recentDiaries.map((diary) => (
            <div
              className="diary-item"
              key={diary.id}
              onClick={() => navigate(`/diaries?postId=${diary.id}`)}
            >
              <p>{diary.title}</p>
              <span>{diary.date}</span>
            </div>
          ))
        )}
      </div>

      <div className="play-area" onClick={() => navigate("/write")}>
        <div className="play-triangle"></div>
      </div>
    </section>
  );
}

export default RecentDiaryBox;