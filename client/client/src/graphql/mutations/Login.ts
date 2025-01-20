import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation LoginUser($loginInput: LoginDtoInput!) {
        login(loginInput: $loginInput) {
            user {
                id
                email
                fullName
            }
        }
    }
`;