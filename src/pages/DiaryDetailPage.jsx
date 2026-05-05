import { useParams } from "react-router-dom";

function DiaryDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>일기 상세 페이지</h2>
      <p>{id}번 일기입니다.</p>
    </div>
  );
}

export default DiaryDetailPage;