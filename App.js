import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMoviesState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const starWarsMoviesResponse = await fetch(
        "https://swapi.dev/api/films/"
      ).then((Response) => {
        if (!Response.ok) {
          throw new Error(Response.status);
        }
        return Response.json();
      });
      const moviesFormated = starWarsMoviesResponse.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });
      setMoviesState(moviesFormated);
      setIsLoading(false);
    } catch (error) {
      setErrorState(error + ".  Something went wrong");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function addMovieHandler(movie) {
    console.log(movie);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (errorState) {
    content = <p>{errorState}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
