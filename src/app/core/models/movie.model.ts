import { MovieResponseDTO, PostMovieDTO } from "../dto/postmovie.dto";
import { GenreModel } from "./genre.model";
import { Review } from "./review.model";
import { CreditModel } from "./serie.model";

// MovieModel est notre model de données pour les films sur notre application
// ex: dans un component movie.titre pour afficher le titre du film
export type MovieModel = {
    api_id?: number;
    tmdb_id: number;
    credits: CreditModel;
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

/**
 * Cette classe expose les méthodes de mapping des données de film
 * en provenance de l'API TMDB
 *
 * elles sont utilisées dans TBDBService
 * au moment où on fait une http request pour récupérer les films
 * exemple:
 *
 * this.http.get('https://api.themoviedb.org/3/discover/movies').pipe(
 *  (responseFromTmdb) => MovieModelMapper.mapFromTmdb(responseFromTmdb) : MovieModel
 * )
 *
 */
export class MovieModelMapper {

    static mapFromTmdb(movie: any): MovieModel {
        return {
            tmdb_id: movie.id,
            titre: movie.title,
            credits : movie.credits,
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

    // static mapFromApi(movie: MovieResponseDTO): MovieModel {
    //     return {
    //         api_id: movie.id,
    //         tmdb_id: movie.id_tmdb,
    //         titre: movie.title,
    //         resume: movie.overview,
    //         duration: movie.duration,
    //         image_landscape: '',
    //         image_portrait: movie.poster_path,
    //         score: movie.score,
    //         genres: movie.genres ? movie.genres : [],
    //         date: movie.release_date,
    //         hasVideo: false,
    //         video: '',
    //         //this.videos = movie.videos?.results.length > 0 ? movie.videos.results : []
    //         reviews: []
    //     }
    // }
}
