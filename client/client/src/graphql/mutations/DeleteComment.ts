import { gql } from "@apollo/client";

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: Int!) {
        deleteComment(id: $id) {
            id
            __typename
        }
    }
`