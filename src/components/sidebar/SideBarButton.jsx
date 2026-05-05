function SidebarButton({ text, onClick }) {
  return (
    <div className="sidebar-button" onClick={onClick}>
      {text}
    </div>
  );
}

export default SidebarButton;