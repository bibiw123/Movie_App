import { GenreModel } from "../models/genre.model"
import { MovieModel } from "../models/movie.model"

export type PostMovieDTO = {
    id_tmdb: number,
    poster_path: string,
    release_date: Date,
    title: string,
    duration: number,
    overview: string,
    score: number,
    genres: GenreModel[]
}

export class MovieDTOMapper {

    static mapFromMovieModel(movie: MovieModel): PostMovieDTO {
        return {
            id_tmdb: movie.id,
            poster_path: movie.image_portrait,
            release_date: movie.date,
            title: movie.titre,
            duration: movie.duration ? movie.duration : 0,
            overview: movie.resume,
            score: movie.score,
            genres: movie.genres
        }
    }

}