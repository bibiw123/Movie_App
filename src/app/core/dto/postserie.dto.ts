import { GenreModel } from "../models/genre.model"
import { MovieModel } from "../models/movie.model"
import { SeasonModel, TvShowModel } from "../models/serie.model"


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
    seasons: SeasonModel[]
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
            seasons: serie.seasons
        }
    }

}



