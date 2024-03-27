// type Credentials
export type UserCredentialsDTO = {
    email: string,
    password: string
}
export type UserCredentialsResponseDTO = {
    token: string,
    user: {
        username: string,
        email: string
    }
}
