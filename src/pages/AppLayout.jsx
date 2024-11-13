// import AppNav from "../Components/AppNav";
import styles from "./AppLayout.module.css";
import SideBar from "../Components/SideBar";
import Map from "../Components/Map";
import User from "../Components/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
