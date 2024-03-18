import { BehaviorSubject, Observable } from "rxjs";

export abstract class AuthGateway {

	
    public isAuth$!:Observable<boolean>;

	abstract register(user:any):Observable<any>
    	// poster un userDTO {username, email, password}
       
    
    
    abstract login(user:any):Observable<any>
     
    
    
    abstract logout():Observable<any> 
   
    
    
    abstract storeTokenInLocalStorage():void
    
    
    
    abstract getTokenFromLocalStorage():string 
    
    

}
