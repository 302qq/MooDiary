import HeroBox from "./HeroBox";
import RecentDiaryBox from "./RecentDiaryBox";
import StampSummaryBox from "./StampSummaryBox";
import WeeklyStampBox from "./WeeklyStampBox";
import YesterdayRecord from "./YesterdayRecord";

function MainContent() {
  return (
    <div className="home-page">
      <HeroBox />

      <div className="home-middle">
        <RecentDiaryBox />

        <div className="stamp-column">
          <StampSummaryBox />
          <WeeklyStampBox />
        </div>
      </div>

      {/* 👇 여기로 이동 */}
      <YesterdayRecord />
    </div>
  );
}
export default MainContent;