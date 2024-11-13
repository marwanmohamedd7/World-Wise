/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = `http://localhost:8000`;
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "cities/LOADED":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/LOADED":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/CREATED":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/DELETED":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "REJECTED":
      return { isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error("There was an error fetching cities...");
        const data = await res.json();
        dispatch({ type: "cities/LOADED", payload: data });
      } catch (err) {
        dispatch({ type: "REJECTED", payload: err.message });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        if (!res.ok) throw new Error("There was an error getting city...");
        const data = await res.json();
        dispatch({ type: "city/LOADED", payload: data });
      } catch (err) {
        dispatch({ type: "REJECTED", payload: err.message });
      }
    },
    [currentCity.id]
  );

  async function createNewCity(newCity) {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("There was an error creating city...");
      const data = await res.json();
      dispatch({ type: "city/CREATED", payload: data });
    } catch (err) {
      dispatch({ type: "REJECTED", payload: err.message });
    }
  }

  async function deletingCity(id) {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("There was an error deleting city...");
      dispatch({ type: "city/DELETED", payload: id });
    } catch (err) {
      dispatch({ type: "REJECTED", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createNewCity,
        deletingCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
