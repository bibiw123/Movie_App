import { BehaviorSubject, Observable } from "rxjs";

export abstract class AuthGateway {

    public isAuth$!: Observable<boolean>;
    abstract register(user: any): Observable<any>
    abstract login(user: any): Observable<any>
    abstract logout(): Observable<any>
    abstract storeTokenInLocalStorage(token: string): void
    abstract getTokenFromLocalStorage(): string | null

}
