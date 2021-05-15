const express = require("express");
const Celebrity = require("../models/celebrity.js");
const router = express.Router();

const Movie = require("../models/movie.js");

router.get("/movies", (req, res, next) => {
  Movie.find()
    .then((movies) => res.render("movies/index", { movies: movies }))
    .catch((err) => next(err));
});

router.get("/movies/new", (req, res, next) => {
  Celebrity.find()
    .then(function (celebritiesFromDb) {
      res.render("movies/new", { celebrities: celebritiesFromDb });
    })
    .catch((err) => next(err));
});

router.post("/movies", (req, res, next) => {
  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    plot: req.body.plot,
    cast: req.body.cast,
  });
  movie
    .save()
    .then(function (movieFromDb) {
      console.log(movieFromDb);
      res.redirect("/movies");
    })
    .catch((err) => next(err));
});

router.post("/movies/:id/delete", (req, res, next) => {
  Movie.findByIdAndRemove(req.params.id)
    .then((movie) => res.redirect("/movies"))
    .catch((err) => next(err));
});

router.get("/movies/:id/edit", (req, res, next) => {
  Celebrity.find()
    .then(function (celebrities) {
      Movie.findById(req.params.id)
        .then((movie) => {
          // console.log(movie, celebrities);
          const celebritieswithCheck = celebrities.map((el) => {
            if (movie.cast.includes(el._id)) {
              el.check = true;
            } else {
              el.check = false;
            }
            return el;
          });
          console.log(celebritieswithCheck, celebrities)
          res.render("movies/edit", { movie: movie, celebrities: celebritieswithCheck });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.get("/movies/:id", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((movie) => res.render("movies/show", { movie: movie }))
    .catch((err) => next(err));
});
router.post("/movies/:id", (req, res, next) => {
  Movie.findOneAndUpdate({_id: req.params.id}, {$set: {...req.body}})
    .then((movie) => res.redirect("/movies"))
    .catch((err) => next(err));
});

module.exports = router;
