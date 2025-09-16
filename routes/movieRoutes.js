import express from "express";
import { searchMovies, movieDetails } from "../controllers/movieController.js";

const router = express.Router();

router.get("/movies", searchMovies);
router.get("/movies/:imdbID", movieDetails);

export default router;
