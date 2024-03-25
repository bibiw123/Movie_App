import { GenreModel } from "../models/genre.model"
import { MovieModel } from "../models/movie.model"
import { CommentDTO } from "./comment.dto"

type MovieDTO = {
    id: number,
    id_tmdb: number,
    poster_path: string,
    release_date: Date,
    title: string,
    duration: number,
    overview: string,
    score: number,
    genres: GenreModel[],
    comments: CommentDTO[]
}
export type PostMovieDTO = Omit<MovieDTO, 'id' | 'comments'>
export type MovieResponseDTO = MovieDTO;

export class MovieDTOMapper {

    static mapFromMovieModel(movie: MovieModel): PostMovieDTO {
        return {
            id_tmdb: movie.tmdb_id,
            poster_path: movie.image_portrait,
            release_date: movie.date,
            title: movie.titre,
            duration: movie.duration ? movie.duration : 0,
            overview: movie.resume,
            score: movie.score,
            genres: movie.genres
        }
    }

    static mapToMovieModel(movie: PostMovieDTO): MovieModel {
        return {
            tmdb_id: movie.id_tmdb,
            titre: movie.title,
            duration: movie.duration,
            resume: movie.overview,
            image_landscape: '',
            image_portrait: movie.poster_path,
            score: movie.score,
            genres: movie.genres,
            date: movie.release_date,
            hasVideo: false,
            video: undefined,
            reviews: []
        }
    }

}