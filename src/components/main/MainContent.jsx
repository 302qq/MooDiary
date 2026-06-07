import HeroBox from "./HeroBox";
import RecentDiaryBox from "./RecentDiaryBox";
import StampSummaryBox from "./StampSummaryBox";

function MainContent() {
  return (
    <div className="home-page">
      <HeroBox />

      <div className="home-layout">
        <RecentDiaryBox />
        <StampSummaryBox />
      </div>
    </div>
  );
}

export default MainContent;
