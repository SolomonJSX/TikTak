import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation RegisterUser($registerInput: RegisterDtoInput!) {
        register(registerInput: $registerInput) {
            user {
                id
                email
                fullName
            }
        }
    }
`;