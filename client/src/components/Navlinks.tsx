import { NavLink } from "react-router-dom";
import { links } from "../utils/links";
import { useHomepageContext } from "../pages/HomepageLayout";

const NavLinks = ({ smallScreen }: { smallScreen: boolean }) => {
  const { toggleSidebar } = useHomepageContext();
  return (
    <>
      {links.map((link) => {
        const { text, path, className } = link;

        return (
          <li key={text}>
            <NavLink
              to={path}
              className={className}
              onClick={smallScreen ? toggleSidebar : () => {}}
              end
            >
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
