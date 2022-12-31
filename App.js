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
        "https://AAI-3UO4zcRBg-AYO9Gu.firebaseio.com/movies.json"
      ).then((Response) => {
        if (!Response.ok) {
          throw new Error(Response.status);
        }
        return Response.json();
      });
      const moviesFormated = Object.entries(starWarsMoviesResponse).map(
        (movie) => {
          return {
            id: movie[0],
            title: movie[1].title,
            releaseDate: movie[1].releaseDate,
            openingText: movie[1].openingText,
          };
        }
      );
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

  const addMovieHandler = async (movie) => {
    console.log("movie: " + Object.entries(movie));
    const addMovieResponse = await fetch(
      "https://AAI-3UO4zcRBg-AYO9Gu.firebaseio.com/movies.json",
      {
        method: "Post",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );
    const addMovieResponseJson = await addMovieResponse.json();
    console.log(
      "addMovieResponseJson: " + Object.entries(addMovieResponseJson)
    );
  };

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
