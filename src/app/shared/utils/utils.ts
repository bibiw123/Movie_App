export class Utils {

    /**
     * getUrlEndpoint
     * @param baseUrl 
     * @param fullUrl 
     * @returns string - fragment of endpoint
     * usage exemple : 
     * getUrlEndpoint('https:myapi.com', 'https:myapi.com/auth/login')
     * return "/auth/login"
     */
    static getUrlEndpoint(baseUrl: string, fullUrl: string): string {
        console.log('endpoint:', fullUrl.split(baseUrl)[1])
        return fullUrl.split(baseUrl)[1]
    }
}