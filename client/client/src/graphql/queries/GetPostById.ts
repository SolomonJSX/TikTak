import { gql } from "@apollo/client";

export const GET_POST_BY_ID = gql`
    query GetPostById($id: Int!) {
        postById(id: $id) {
            post {
      id
            text
            video
            createdAt
            user {
                id
                fullName
                email
                image
            }
            likes {
                id
                userId
                postId
            }
            
    }
    
    otherPostIds
        }
    }
`;