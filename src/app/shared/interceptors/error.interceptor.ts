import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AlertService } from '../services/alert.service';

type APIErrorResponse = {
  error_message: string,
  status: number
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  MY_API = environment.API_URL

  constructor(private _route: Router, private _alert: AlertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    console.log('Error Interceptor', req);

    return next.handle(req).pipe(
      tap({
        error: (err) => {
          console.log(err)
          if (err instanceof HttpErrorResponse) {
            const error = err.error as APIErrorResponse;
            switch (err.status) {
              // detecter si error_message est une instanceof string ou un objet
              case 400:
                // if (req.url.includes(this.MY_API+'/users') && req.method=='POST')
                this._alert.show(error.error_message, 'error');
                break;
              case 401:
                this._alert.show(error.error_message, 'error');
                //this._route.navigate(['/login']);
                break;
              case 403:
                this._alert.show(error.error_message, 'error')
                break;
              case 404:
                this._alert.show(error.error_message, 'error')
                break;
              case 419:
                this._alert.show(error.error_message, 'error')
                break;
              case 409:
                this._alert.show(error.error_message, 'error')
                break;
              case 500:
                this._alert.show('Erreur serveur', 'error')
                break;
              default:
                this._alert.show("Erreur serveur", 'error')
            }
          }

        }
      })
    )
  }

}
