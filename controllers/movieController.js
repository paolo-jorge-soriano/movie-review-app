import axios from "axios";
import pool from "../config/db.js";

const OMDB_API = "http://www.omdbapi.com/";

export async function searchMovies(req, res) {
  const query = req.query.q;
  if (!query) {
    return res.render("movies/search", { title: "Search Movies", movies: [] });
  }

  try {
    const response = await axios.get(OMDB_API, {
      params: {
        s: query,
        apikey: process.env.OMDB_API_KEY,
      },
    });

    const movies = response.data.Search || [];
    res.render("movies/search", { title: "Search Movies", movies });
  } catch (err) {
    console.error(err);
    res.render("movies/search", { title: "Search Movies", movies: [] });
  }
}

export async function movieDetails(req, res) {
  const imdbID = req.params.id;

  try {
    const response = await axios.get(OMDB_API, {
      params: {
        i: imdbID,
        apikey: process.env.OMDB_API_KEY,
      },
    });

    const movie = response.data;
    res.render("movies/details", { title: movie.Title, movie });
  } catch (err) {
    console.log(err);
    res.redirect("/movies");
  }
}
