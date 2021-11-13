const express = require("express");
const movies_router = express.Router();
require('dotenv').config()
const fetchMovieData = require('./api/movie_api_calls')
movies_router.use(express.static(__dirname));
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
var filter;

// Custom Middleware
function Genres(req, res, next) {
    fetchMovieData.fetchGenres(BASE_URL, API_KEY) 
    .then((data) => {
        filter = data.genres;
        next()
        return filter
      }); 
}
// Fetch genres first before each page.
movies_router.use(Genres);

// Home Page.... (Personal Note: Fix page navigation error.)
movies_router.get("/movies/:page?", (req, res) => {
  if(!req.params.page) {
    req.params.page = 1
  }
  fetchMovieData.getMovies(BASE_URL, API_KEY, req.params.page, "", "")
    .then(movies => {
     let movieResults = movies.results.filter(movies => movies.poster_path)
     let numberOfPages = movies.total_pages;
      if (movieResults && req.params.page <= numberOfPages) {
        res.render("movies", {
          movies: movieResults,
          genre: filter,
          numPages: numberOfPages,
          pageName: "Movies",
          movieName: "Movies",
          url: req.baseUrl,
          page: parseInt(req.params.page),
        });
      } else console.log("ERROR");
    })
    .catch((err) => {
      console.log(err);
    });
 
});

//..................................
movies_router.get("/movies/year/:year(20[12][0-9])/:page?", (req, res) => {
  if(!req.params.page) {
    req.params.page = 1
  }
  fetchMovieData.getMovies(BASE_URL, API_KEY, req.params.page, "", req.params.year)
    .then(movies => {
     let movieResults = movies.results.filter(movies => movies.poster_path);
     let numberOfPages = movies.total_pages;
      if(movieResults && req.params.page <= numberOfPages) {
        res.render("movies", {
          movies: movieResults,
          numPages: numberOfPages,
          genre: filter,
          movieName: req.params.year + " Movies",
          pageName: req.params.year,
          page: parseInt(req.params.page),
          url: req.baseUrl,
        });
      }
       else{
         res.render("error" , {genre: filter, url: req.originalUrl.slice(
          0,
          req.originalUrl.lastIndexOf(req.params.page)
        )})
       } 
    })
    .catch((err) => {
      console.log(err);
    });
});
//..................................

movies_router.get("/movies/genres/:genre/:page?", async (req, res) => {
  var selected;
  if(!req.params.page) {
    req.params.page = 1
  }
  for (var i = 0; i < filter.length; i++) {
    if (req.params.genre === filter[i].name.toLowerCase()) {
      selected = filter[i].id; 
    }
  }
  fetchMovieData.getMovies(BASE_URL, API_KEY, req.params.page, selected, "")
    .then(movies => {
    let  movieResults = movies.results.filter(movies => movies.poster_path)
     let numberOfPages = movies.total_pages;
      if(movieResults && req.params.page <= numberOfPages){
        res.render("movies", {
          movies: movieResults,
          genre: filter,
          numPages: numberOfPages,
          movieName: req.params.genre ,
          url: req.baseUrl,
          pageName:
            req.params.genre.charAt(0).toUpperCase() +
            req.params.genre.slice(1),
          page: parseInt(req.params.page),
          url: req.originalUrl.slice(
            0,
            req.originalUrl.indexOf(req.params.page)
          ),
        });
      } else {res.render("error" , {genre: filter, url: req.originalUrl.slice(
        0,
        req.originalUrl.lastIndexOf(req.params.page)
      )})}
    })
    .catch((err) => {
      console.log(err);
    });
});

// // ........................................

movies_router.get("/movies/cast/:id/:name?", (req, res) => {

  fetchMovieData.getCast(BASE_URL, req.params.name, API_KEY)
    .then(async (data) => {
     let actor = await data.results.filter((obj) => {
        return obj.id == parseInt(req.params.id);
      });

      if (actor) {
        fetchMovieData.getActor(BASE_URL, req.params.id, API_KEY)
          .then(async (data) => {
           let actor_details = await data;
           fetchMovieData.getMoviesWithActor(BASE_URL, API_KEY, 1, req.params.id)
           .then(moviesWithActor => {
            let knownFor = moviesWithActor.results.filter(movies => movies.poster_path)

            res.render("movies-with-actor", {
              genre: filter,
              actor: actor,
              actor_details: actor_details,
              movies: knownFor,
              baseUrl: req.baseUrl,
              pageName: actor_details.name
            });
           })
          });
         
      }
      else {res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})}
    });
});

//..............................

movies_router.get("/movies/film/trending-today", async (req, res) => {

  fetchMovieData.getTrending(BASE_URL, "day", API_KEY)
    .then((data) => {
     let trending = data.results.filter(movies => movies.poster_path);
      res.render("movies_trending", {
      movies: trending,
      url: req.baseUrl,
       genre: filter,
       movieName: "Trending Today",
      pageName: "Trending Today",
  });
    })
    .catch((err) => {
      console.log(err, "ERROR OCCURED")
      res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})
    });

});
//...............
movies_router.get("/movies/film/top-rated/:page?", async (req, res) => {
  if(!req.params.page) {
    req.params.page = 1
  }
  fetchMovieData.getPopular(BASE_URL, API_KEY, req.params.page)
    .then(movies => {
      let popular = movies.results.filter(movies => movies.poster_path)
      let numberOfPages = movies.total_pages;
      if(req.params.page <= numberOfPages){
       res.render("movies", {
        movies: popular,
        numPages: numberOfPages,
        genre: filter,
        movieName: "Popular Movies",
        url: req.baseUrl,
        page: parseInt(req.params.page),
        pageName: "Top Rated",
      });
    }
    })
    .catch((err) => {
      console.log(err);
      res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})
    });

});
//................................
movies_router.get("/movies/film/now-playing/:page?", async (req, res) => {
  if(!req.params.page) {
    req.params.page = 1
  }
  fetchMovieData.getNowPlaying(BASE_URL,  API_KEY, req.params.page)
    .then((movies) => {
      let nowPlaying = movies.results.filter(movies => movies.poster_path)
      let numberOfPages = movies.total_pages;
      if(req.params.page <= numberOfPages){
        res.render("movies", {
        movies: nowPlaying,
        numPages: numberOfPages,
        url: req.baseUrl,
        genre: filter,
        movieName: "Now Playing",
        page: parseInt(req.params.page),
        pageName: "Now Playing",
      });
    }
     else {res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})}
    })
    .catch((err) => {
      console.log(err);
      res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})
    });
  
});
// // ...........................................

movies_router.get("/movies/film/trending-this-week", async (req, res) => {
  fetchMovieData.getTrending(BASE_URL, "week", API_KEY)
    .then((movies) => {
      let trendingThisWeek = movies.results.filter(movies => movies.poster_path);
      res.render("movies_trending", {
        movies: trendingThisWeek,
        url: req.baseUrl,
        movieName: "Trending This Week",
        genre: filter,
        pageName: "Trending This Week",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("error" , {genre: filter, url: req.originalUrl.slice(0,)})
    });

});

// // .................................

movies_router.get("/movies/film/search/q=:movie/:page?", async (req, res) => {
    fetchMovieData.getSearchResults(BASE_URL, API_KEY, req.params.movie, req.params.page)
    .then(movies => {
     let numberOfPages = movies.total_pages;
     let searchResults = movies.results.filter(movies => movies.poster_path) 
    if (movies && req.params.page <= numberOfPages) {
      if (searchResults.length > 1) {
          res.render("movies", {
          movies: searchResults,
          genre: filter,
          movieName:  req.params.movie.replace("-", " ") + " Results",
          url: req.baseUrl,
          numPages: numberOfPages,
          pageName: `Results For ${
            req.params.movie.charAt(0).toUpperCase() + req.params.movie.slice(1)
          }`,
          page: parseInt(req.params.page),
        }); 

      } else if (searchResults.length === 1) {
        res.redirect(`/movies/m/${searchResults[0].id}/${searchResults[0].original_title.replace(/[\s]/g, "-")}`);
      } else{
        res.render("error" , {genre: filter, url: req.originalUrl.slice(
          0,
          req.originalUrl.lastIndexOf(req.params.page)
        )})
      } 
        
      } else{
        res.render("error" , {genre: filter, url: req.originalUrl.slice(
          0,
          req.originalUrl.lastIndexOf(req.params.page)
        )})
      } 
    });
    
});

// ....................................................

movies_router.get("/movies/m/:movie/:movies?", async (req, res) => {

  fetchMovieData.returnMovie(BASE_URL, req.params.movie, API_KEY)
    .then(async movies => { 
     let movie = await movies
     let cast = await movies.credits.cast;
     let crew = await movies.credits.crew.filter(jobType => {
        return jobType.job === "Director";
      });
      let movieResults = movies.similar.results.filter(movies => movies.poster_path)
      let movie_video = await movies.videos.results.filter((obj) => {
        return obj.type === "Trailer";
      });
          if(movieResults) { 
                      res.render("movie-preview", {
                        movie: movie,
                        genre: filter,
                        cast: cast,
                        crew: crew,
                        pageName: movie.title,
                        baseUrl: req.baseUrl,
                        movies: movieResults,
                        data: movie_video[0] ? movie_video[0].key : "" ,
                      });
                    console.log(movie)
                 }
      else{
        res.render("error" , {genre: filter, url: ""
        })
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


movies_router.use((req, res, next) => {
res.status(404);
res.render("error", {genre: filter,url: req.originalUrl.slice(
  0,
  req.originalUrl.lastIndexOf(req.params.page)
) })
})

module.exports = movies_router;
