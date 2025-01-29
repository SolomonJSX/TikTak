import { gql } from "@apollo/client";

export const UNLIKE_POST = gql`
    mutation UnlikePost($postId: Int!) {
        unlikePost(postId: $postId) {
            id
            userId
            postId
        }
    }
`