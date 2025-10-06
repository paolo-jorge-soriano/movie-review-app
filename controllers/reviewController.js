import pool from "../config/db.js";

// Add review
export async function addReview(req, res) {
  if (!req.user) {
    req.flash("error", "You must be logged in to leave a review.");
    return res.redirect("/login");
  }

  try {
    const { movie_id, rating, comment } = req.body;

    await pool.query(
      `INSERT INTO reviews (user_id, movie_id, rating, comment) 
      VALUES ($1, $2, $3, $4)`,
      [req.user.id, movie_id, rating, comment]
    );

    req.flash("info", "Review added successfully!");
    res.redirect(`/movies/${movie_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding review!");
  }
}

export async function getReviewsByMovie(movie_id) {
  const result = await pool.query(
    `SELECT r.*, u.username
    FROM reviews AS r
    INNER JOIN users AS u
      ON r.user_id = u.id
    WHERE r.movie_id = $1
    ORDER BY created_at DESC`,
    [movie_id]
  );

  return result.rows;
}
