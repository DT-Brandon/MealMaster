import "./sidebar.css";

export default function Sidebar({ setPage, pages }) {
  const linkList = pages.map((page) => {
    return (
      <li
        className="sidebarListItem"
        key={page.text}
        onClick={() => {
          setPage(page.text);
        }}
      >
        {page.text}
      </li>
    );
  });
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">{linkList}</ul>
      </div>
    </div>
  );
}
