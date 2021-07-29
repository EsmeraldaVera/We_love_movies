const { queryBuilder } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const critic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function movieReviews(movieId) {
  return knex("movies")
    .select(
      "reviews.review_id",
      "reviews.content",
      "reviews.score",
      "movies.movie_id",
      "critics.critic_id",
      "critics.preferred_name",
      "critics.surname",
      "critics.organization_name",
      "critics.created_at",
      "critics.updated_at"
    )
    .join("reviews", "reviews.movie_id", "movies.movie_id")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .where({ "movies.movie_id": movieId })
    .then((data) => data.map((i) => critic(i)));
}

function theaterByMovieId(movieId) {
  return knex("theaters")
    .select("*")
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .join(
      "movies_theaters",
      "theaters.theater_id",
      "movies_theaters.theater_id"
    )
    .where({ "movies_theaters.is_showing": true })
    .where({ "movies.movie_id": movieId });
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

function list(is_showing) {
  return knex("movies as m")
    .select("m.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join("movies_theaters", "m.movie_id", "movies_theaters.movie_id")
          .where({ "movies_theaters.is_showing": true })
          .groupBy("m.movie_id");
      }
    });
}

module.exports = {
  list,
  read,
  theaterByMovieId,
  movieReviews,
};
