/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesProvider";

function CityItem({ city }) {
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date));

  const { currentCity, deletingCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  function handleDeletingCity(e) {
    e.preventDefault();
    deletingCity(id);
  }
  
  return (
    <li>
      <NavLink
        className={`${styles.cityItem} ${
          id === currentCity?.id ? styles[`cityItem--active`] : ``
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDeletingCity}>
          &times;
        </button>
      </NavLink>
    </li>
  );
}

export default CityItem;
