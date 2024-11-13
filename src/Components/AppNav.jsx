import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

function AppNav() {
  return (
    <div>
      <h1 className={styles.nav}>
        <ul>
          <NavLink to={`cities`}>
            <li>Cities</li>
          </NavLink>
          <NavLink to={`countries`}>
            <li>Countries</li>
          </NavLink>
        </ul>
      </h1>
    </div>
  );
}

export default AppNav;
