import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
    mutation CreateComment($postId: Int!, $text: String!) {
        createComment(postId: $postId, text: $text) {
            text
            id
            createdAt
            user {
                id
                fullName
                email
            }
            post {
                id
                text
                video
            }
        }
    }
`