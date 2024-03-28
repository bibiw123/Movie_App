import { GenreModel } from "./genre.model";
import { Review } from "./review.model";

export type EpisodeModel = {

}

export type SeasonModel = {
    id: number
    air_date: Date
    episode_count: number
    name: string;
    season_number: number;
    episodes: EpisodeModel[]
}

export type CreditModel = {
    cast: any[];
    crew: any[];
}


export class TvShowModel {
    id: number;
    titre: string;
    resume: string;
    episode_runtime: number | undefined;
    episode_count: number | undefined;
    last_air_date: Date | undefined;
    created_by: any[] | undefined;
    credits: CreditModel | undefined;
    image_landscape: string;
    image_portrait: string;
    score: number;
    genres: GenreModel[];
    date: Date;
    video: any[];
    reviews: Review[];
    seasons: SeasonModel[];

    constructor(tv: any) {
        this.id = tv.id;
        this.titre = tv.name;
        this.resume = tv.overview;
        this.episode_runtime = tv.episode_run_time ? tv.episode_run_time : undefined;
        this.episode_count = tv.number_of_episodes
            ? tv.number_of_episodes
            : undefined;
        this.last_air_date = tv.last_air_date ? new Date(tv.last_air_date) : undefined;
        this.created_by = tv.created_by ? tv.created_by : undefined;
        this.credits = tv.credits ? tv.credits : undefined;
        this.image_landscape = tv.backdrop_path;
        this.image_portrait = tv.poster_path;
        this.score = tv.vote_average;
        this.genres = tv.genres ? tv.genres : [];
        this.date = tv.first_air_date;
        this.video = tv.videos?.results.length > 0 ? tv.videos.results : undefined;
        this.reviews = []
        this.seasons = tv.seasons ? tv.seasons : [];
    }
}