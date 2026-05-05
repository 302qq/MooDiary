import { Routes, Route } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

import HomePage from "../../pages/HomePage";
import WriteDiaryPage from "../../pages/WriteDiaryPage";
import DiaryListPage from "../../pages/DiaryListPage";
import StampCalendarPage from "../../pages/StampCalendarPage";
import DiaryDetailPage from "../../pages/DiaryDetailPage";

function ContentLayout() {
  return (
    <div className="content">
      <Sidebar />

      <div className="main-area">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WriteDiaryPage />} />
          <Route path="/diaries" element={<DiaryListPage />} />
          <Route path="/stamps" element={<StampCalendarPage />} />
          <Route path="/diaries/:id" element={<DiaryDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default ContentLayout;