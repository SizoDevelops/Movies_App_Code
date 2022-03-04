const fetch = require("node-fetch");

const fetchMovieData = {
    async returnMovie(url, movie, api) {
        let response = await fetch(`${url}movie/${movie}?api_key=${api}&language=en-US&append_to_response=videos,similar,credits`)
        return await response.json()
    },
    async getMovies(url, key, page, movieGenre, movieYear) {
        let response = await fetch(
          `${url}discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=${page}&primary_release_year=${movieYear}&with_genres=${movieGenre}&vote_average.gte=1&with_watch_monetization_types=flatrate`
        );
        return await response.json();
      
      },
      async fetchGenres(url, api) {
       let response =  await fetch(`${url}genre/movie/list?api_key=${api}&language=en-US`)
      return await response.json()
      },
      async getSearchResults(url, api, query, page) {
            let response = await fetch( `${url}search/movie?api_key=${api}&language=en-US&query=${query}&page=${page}&include_adult=false`)
            return await response.json()
      },
      async returnPeople(url, api, query, page) {
            let response = await fetch( `${url}search/person?api_key=${api}&language=en-US&query=${query}&page=${page}&include_adult=false`)
            return await response.json()
      },
      async getTrending(url, time, api) {
        let response = await fetch(`${url}trending/movie/${time}?api_key=${api}`)
        return await response.json()
      },
      async getNowPlaying(url, api, page) {
        let response = await fetch(`${url}movie/now_playing?api_key=${api}&language=en-US&page=${page}`)
        return await response.json()
      },
      async getPopular(url, api, page) {
        let response = await fetch(`${url}movie/top_rated?api_key=${api}&language=en-US&page=${page}`)
        return await response.json()
      },
      async getCast(url, actor, api) {
            let response = await fetch( `${url}search/person?api_key=${api}&language=en-US&query=${actor}&page=1&include_adult=false`)
            return await response.json()
      },
      async getActor(url, id, api) {
        let response = await fetch( `${url}person/${id}?api_key=${api}&language=en-US`)
        return await response.json()
      },
      async getMoviesWithActor(url, key, page, actor) {
        let response = await fetch(
          `${url}discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=${page}&with_cast=${actor}&with_watch_monetization_types=flatrate`
        );
        return await response.json();
      
      },
}
module.exports = fetchMovieData;