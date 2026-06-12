import { Navigate, Routes, Route } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

import HomePage from "../../pages/HomePage";
import WriteDiaryPage from "../../pages/WriteDiaryPage";
import DiaryListPage from "../../pages/DiaryListPage";
import StampCalendarPage from "../../pages/StampCalendarPage";
import DiaryDetailPage from "../../pages/DiaryDetailPage";
import SignupPage from "../../pages/SignupPage";
import LoginPage from "../../pages/LoginPage";
import AIResultPage from "../../pages/AIResultPage";

function HomeRoute() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <HomePage />;
}

function ContentLayout() {
  return (
    <div className="content">
      <Sidebar />

      <div className="main-area">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/write" element={<WriteDiaryPage />} />
          <Route path="/diaries" element={<DiaryListPage />} />
          <Route path="/stamps" element={<StampCalendarPage />} />
          <Route path="/diaries/:id" element={<DiaryDetailPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<StampCalendarPage />} />
          <Route path="/ai-result" element={<AIResultPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default ContentLayout;
