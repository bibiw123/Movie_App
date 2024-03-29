import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { MovieListViewComponent } from './views/movies/movie-list-view/movie-list-view.component';
import { MovieDetailViewComponent } from './views/movies/movie-detail-view/movie-detail-view.component';
import { TvListViewComponent } from './views/tv/tv-list-view/tv-list-view.component';
import { TvDetailViewComponent } from './views/tv/tv-detail-view/tv-detail-view.component';
import { PersonDetailViewComponent } from './views/person/person-detail-view/person-detail-view.component';
import { WatchlistComponent } from './views/user/watchlist/watchlist.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { RegisterViewComponent } from './views/user/register-view/register-view.component';
import { LoginViewComponent } from './views/user/login-view/login-view.component';

import { ActionbarComponent } from './views/movies/movie-list-view/actionbar/actionbar.component';
import { SearchbarComponent } from './shared/ui-components/ui-searchbar/ui-searchbar.component';
import { CardComponent } from './shared/ui-components/ui-card/ui-card.component';
import { DropdownComponent } from './shared/ui-components/ui-dropdown/ui-dropdown.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PrintdurationPipe } from './shared/pipes/printduration.pipe';
import { ClickoutsideDirective } from './shared/directives/clickoutside.directive';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';


import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { TMDBGateway } from './core/ports/tmdb.gateway';
import { TMDBService } from './core/adapters/tmdb.service';
import { AuthGateway } from './core/ports/auth.gateway';
import { AuthService } from './core/adapters/auth.service';
import { SliderComponent } from './shared/ui-components/ui-slider/ui-slider.component';
import { UserGateway } from './core/ports/user.gateway';
import { UserService } from './core/adapters/user.service';
import { YtPlayerComponent } from './shared/ui-components/yt-player/yt-player.component';
import { ButtonGroupComponent } from './shared/ui-components/ui-button-group/ui-button-group.component';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { UiStarComponent } from './shared/ui-components/ui-star/ui-star.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeViewComponent,
    // movie views
    MovieListViewComponent, MovieDetailViewComponent,
    // tv views
    TvListViewComponent, TvDetailViewComponent,
    // user watchlist view
    WatchlistComponent,
    // person view
    PersonDetailViewComponent,
    // search view
    SearchViewComponent,
    // auth views
    RegisterViewComponent, LoginViewComponent,
    // stateless component
    ActionbarComponent, SearchbarComponent, CardComponent, DropdownComponent,
    // pipes & directives
    PrintdurationPipe,
    SliderComponent,
    YtPlayerComponent,
    ButtonGroupComponent,
    UiStarComponent,
    //ClickoutsideDirective
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule
  ],

  providers: [
    // Configuration PATTERN PORT/ADAPTER (Clean Architcture)
    { provide: TMDBGateway, useClass: TMDBService },
    { provide: AuthGateway, useClass: AuthService },
    { provide: UserGateway, useClass: UserService },


    // Interceptor: TokenInterceptor - pour ajouter un token à la request
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // Interceptor: TokenInterceptor - pour ajouter un token à la request
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // Interceptor: ErrorInterceptor - pour traiter les erreurs HTTP (401, 403, 404, 400, 500)
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    provideAnimationsAsync()
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
