import axios from "axios";
import { getReviewsByMovie } from "./reviewController.js";

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
  const imdbID = req.params.imdbID;

  try {
    const response = await axios.get(OMDB_API, {
      params: {
        i: imdbID,
        apikey: process.env.OMDB_API_KEY,
      },
    });

    const movie = response.data;

    // Fetch reviews
    const reviews = await getReviewsByMovie(imdbID);
    res.render("movies/details", { title: movie.Title, movie, reviews });
  } catch (err) {
    console.log(err);
    res.redirect("/movies");
  }
}
