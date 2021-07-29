const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieReviews(req, res, next) {
  res.json({ data: await service.movieReviews(req.params.movieId) });
}

async function theaterByMovieId(req, res, next) {
  res.json({ data: await service.theaterByMovieId(req.params.movieId) });
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.is_showing) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  theatersByMovieList: asyncErrorBoundary(theaterByMovieId),
  movieReviews: asyncErrorBoundary(movieReviews),
};
