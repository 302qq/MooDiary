import { useParams } from "react-router-dom";

function DiaryDetailPage() {
  const { id } = useParams();

  return (
    <div className="diary-detail-page">
      <div className="diary-detail-title">일기 상세 페이지</div>

      <section className="diary-detail-card">
        <h2>일기 상세</h2>
        <p>{id}번 일기입니다.</p>
      </section>
    </div>
  );
}

export default DiaryDetailPage;
