import { GenreModel } from "./genre.model";
import { Review } from "./review.model";

export type EpisodeModel = {
    id_tmdb: number;
    api_id?: number | undefined;
    air_date: Date;
    episode_number: number;
    season_number: number;
    image_path: string;
    title: string;
    overview: string;
    duration: number;
}

export type SeasonModel = {
    id_tmdb: number
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


export type TvShowModel = {
    api_id?: number | undefined;
    tmdb_id: number;
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
    status: number | undefined;
}

export class TvShowModelMapper {

    static mapFromTmdb(tvshow: any): TvShowModel {
        return {
            tmdb_id: tvshow.id,
            titre: tvshow.name,
            resume: tvshow.overview,
            episode_runtime: tvshow.episode_run_time ? tvshow.episode_run_time[0] : undefined,
            episode_count: tvshow.number_of_episodes ? tvshow.number_of_episodes : undefined,
            last_air_date: tvshow.last_air_date ? tvshow.last_air_date : undefined,
            created_by: tvshow.created_by,
            credits: tvshow.credits,
            image_landscape: tvshow.backdrop_path,
            image_portrait: tvshow.poster_path,
            score: tvshow.vote_average,
            genres: tvshow.genres ? tvshow.genres : [],
            date: tvshow.first_air_date,
            video: tvshow.videos?.results ? tvshow.videos?.results : [],
            reviews: [],
            seasons: tvshow.seasons,
            status: tvshow.status
        }
    }
}
