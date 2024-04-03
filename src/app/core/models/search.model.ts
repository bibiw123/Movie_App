import { GenreModel } from "./genre.model";
import { Review } from "./review.model";
import { CreditModel } from "./serie.model";

export class SearchModel {
    id: number;
    api_id?: number;
    tmdb_id: number;
    credits?: CreditModel;
    titre: string;
    duration?: undefined | number;
    resume?: string;
    image_landscape: string;
    image_portrait: string;
    score: number;
    genres: GenreModel[];
    date: Date;
    hasVideo: boolean;
    video?: string;
    status?: number;
    reviews: Review[];
    media_type: 'movie' | 'tv' | 'person'

    constructor(responseFromApi: any) {
        this.id = responseFromApi.id;
        this.api_id = responseFromApi.id ? responseFromApi.id : undefined;
        this.tmdb_id = responseFromApi.id ? responseFromApi.id : undefined;
        this.titre = (responseFromApi.media_type == 'person' || responseFromApi.media_type == 'tv')
            ? responseFromApi.name
            : responseFromApi.title;

        this.image_landscape = (responseFromApi.media_type == 'movie' || responseFromApi.media_type == 'tv')
            ? responseFromApi.backdrop_path
            : responseFromApi.profile_path,
            this.media_type = responseFromApi.media_type;

        this.image_portrait = (responseFromApi.media_type == 'movie' || responseFromApi.media_type == 'tv')
            ? responseFromApi.poster_path
            : responseFromApi.profile_path,
            this.media_type = responseFromApi.media_type
        this.score = responseFromApi.vote_average
        this.credits = responseFromApi.credits ? responseFromApi.credits : undefined;
        this.resume = responseFromApi.overview ? responseFromApi.overview : undefined;
        this.duration = responseFromApi.runtime ? responseFromApi.runtime : undefined;
        this.genres = responseFromApi.genres ? responseFromApi.genres : [];
        this.date = responseFromApi.release_date ? responseFromApi.release_date : undefined;
        this.hasVideo = responseFromApi.video ? responseFromApi.video : false;
        this.video = responseFromApi.videos?.results.length > 0 ? responseFromApi.videos.results[0].key : undefined;
        this.reviews = []
    }
}
