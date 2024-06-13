import useQuery from "./useQuery";
import { useRef } from "react";
import "./pokemon.css";

export default function Pokemon() {
  const baseURL = `https://pokeapi.co/api/v2/pokemon/`;
  const [pok, err, fetcher] = useQuery(baseURL + "pikachu", {
    name: "name",
    imgURL: 'sprites.other["official-artwork"].front_default',
  });

  const inpRef = useRef(null);
  const btnRef = useRef(null);

  function handleEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      btnRef.current.click();
    }
  }

  function searchPokemon() {
    const pokName = inpRef.current.value;
    const searchURL = baseURL + pokName;
    fetcher(searchURL);
    inpRef.current.value = "";
  }

  return (
    <div className="container">
      <div className="search-bar">
        <input type="text" ref={inpRef} onKeyUp={handleEnter} />
        <button onClick={searchPokemon} ref={btnRef}>
          Search
        </button>
      </div>
      {err && <p style={{ color: "red" }}>{err.message}</p>}
      {pok && (
        <figure style={{ textAlign: "center" }}>
          <img src={pok.imgURL} alt={pok.name} />
          <figcaption>
            <b>{pok.name.toUpperCase()}</b>
          </figcaption>
        </figure>
      )}
    </div>
  );
}
