export class Utils {

    /**
     * getUrlEndpoint
     * @param baseUrl 
     * @param fullUrl 
     * @returns string - fragment of endpoint
     * @example getUrlEndpoint('https:myapi.com', 'https:myapi.com/series/1') => '/series/1'
     */
    static getUrlEndpoint(baseUrl: string, fullUrl: string): string {
        return fullUrl.split(baseUrl)[1]
    }
}