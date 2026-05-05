import TitleBar from "./TitleBar";
import MenuBar from "./MenuBar";
import ContentLayout from "./ContentLayout";

function WindowFrame() {
  return (
    <div className="window">
      <TitleBar />
      <MenuBar />
      <ContentLayout />
    </div>
  );
}

export default WindowFrame;