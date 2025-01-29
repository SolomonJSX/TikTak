import { gql } from "@apollo/client";

export const GET_POSTS_BY_USER_ID = gql`
    query GetPostsByUserId($userId: Int!) {
        postsByUserId(userId: $userId) {
            id
            text
            video
            user {
                id
                fullName
                email
            }
        }
    }
`;