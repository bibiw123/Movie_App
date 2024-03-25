import { MovieResponseDTO, PostMovieDTO } from "../dto/postmovie.dto";
import { GenreModel } from "./genre.model";
import { Review } from "./review.model";

export type MovieModel = {
    api_id?: number;
    tmdb_id: number;
    titre: string;
    duration?: undefined | number;
    resume: string;
    image_landscape: string;
    image_portrait: string;
    score: number;
    genres: GenreModel[];
    date: Date;
    hasVideo: boolean;
    video?: string | undefined;
    //videos: any[];
    reviews: Review[];
}


export class MovieModelMapper {

    static mapFromTmdb(movie: any): MovieModel {
        return {
            tmdb_id: movie.id,
            titre: movie.title,
            resume: movie.overview,
            duration: movie.runtime ? movie.runtime : undefined,
            image_landscape: movie.backdrop_path,
            image_portrait: movie.poster_path,
            score: movie.vote_average,
            genres: movie.genres ? movie.genres : [],
            date: movie.release_date,
            hasVideo: movie.video,
            video: movie.videos?.results.length > 0 ? movie.videos.results[0].key : undefined,
            //this.videos = movie.videos?.results.length > 0 ? movie.videos.results : []
            reviews: []
        }
    }

    static mapFromApi(movie: MovieResponseDTO): MovieModel {
        return {
            api_id: movie.id,
            tmdb_id: movie.id_tmdb,
            titre: movie.title,
            resume: movie.overview,
            duration: movie.duration,
            image_landscape: '',
            image_portrait: movie.poster_path,
            score: movie.score,
            genres: movie.genres ? movie.genres : [],
            date: movie.release_date,
            hasVideo: false,
            video: '',
            //this.videos = movie.videos?.results.length > 0 ? movie.videos.results : []
            reviews: []
        }
    }
}