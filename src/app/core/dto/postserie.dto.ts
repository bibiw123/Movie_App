import { GenreModel } from "../models/genre.model"
import { MovieModel } from "../models/movie.model"
import { EpisodeModel, SeasonModel, TvShowModel } from "../models/serie.model"


export type SerieDTO = {
    first_air_date: Date,
    id_tmdb: number,
    poster_path: string,
    last_air_date?: Date | undefined,
    number_of_episodes?: number | undefined,
    number_of_seasons?: number | undefined,
    overview: string,
    title: string,
    score: number,
    genres: GenreModel[],
    seasons: SeasonDTO[]
}

export type EpisodeDTO = {
    id_tmdb: number,
    air_date: Date,
    episode_number: number,
    season_number: number,
    image_path: string,
    title: string,
    overview: string,
    duration: number
}

export type SeasonDTO = {
    id_tmdb: number,
    poster_path: string,
    season_number: number,
    overview: string,
    // episodes: EpisodeDTO[]
}

export type PostSerieDTO = Omit<SerieDTO, 'id'>
export type SerieResponseDTO = SerieDTO;

export class SerieDTOMapper {

    static mapFromSerieModel(serie: TvShowModel): PostSerieDTO {
        return {
            first_air_date: serie.date,
            id_tmdb: serie.tmdb_id,
            poster_path: serie.image_portrait,
            last_air_date: serie.last_air_date,
            number_of_episodes: serie.episode_count ? serie.episode_count : undefined,
            number_of_seasons: serie.seasons.length ? serie.seasons.length : undefined,
            overview: serie.resume,
            title: serie.titre,
            score: serie.score,
            genres: serie.genres,
            seasons: this.mapSeasons(serie.seasons)
        }
    }

    static mapSeasons(seasons: SeasonModel[]): SeasonDTO[] {
        return seasons.map(season => {
            return {
                id_tmdb: season.id_tmdb,
                poster_path: season.poster_path,
                season_number: season.season_number,
                overview: season.overview,
                // episodes: season.episodes
            }
        })
    }

    static mapFromEpisodeModel(episode: any): EpisodeDTO {
        return {
            id_tmdb: episode.id,
            air_date: episode.air_date,
            episode_number: episode.episode_number,
            season_number: episode.season_number,
            image_path: episode.still_path,
            title: episode.name,
            overview: episode.overview,
            duration: 45
        }

    }


}



