import Link from "next/link";

const navLinks = [
    {
        name: "Home",
        path: "/home"
    },
    {
        name: "Add Entry",
        path: "/forms/form"
    },
    {
        name: "Logout",
        path: "/logout"
    }
];


function ProtectedNavbar() {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <header className="sticky z-30 top-0 bg-white ">
      <nav
        className={`nav ${
          navActive ? "active" : ""
        }
        `}
      >
        <Link href={"/home"}>
          <a onClick={() => setActiveIdx(-1)}>
            <h1 className="text-xl font-semibold">Home</h1>
          </a>
        </Link>
        <div
          className={`menu__icon ${
            navActive ? "active" : "inactive"
          }`}
          onClick={() => setNavActive(!navActive)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`nav__menu ${navActive ? "active" : ""}`}>
          {navLinks.map((menu, idx) => (
            <div
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.href}
            >
              <NavItem {...menu} active={idx === activeIdx} />
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default ProtectedNavbar;