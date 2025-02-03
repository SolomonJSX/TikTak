/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n    mutation CreateComment($postId: Int!, $text: String!) {\n        createComment(postId: $postId, text: $text) {\n            text\n            id\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n": types.CreateCommentDocument,
    "\n    mutation CreatePost($text: String!, $video: Upload!) {\n        createPost(text: $text, video: $video) {\n           id\n           text\n           video \n        }\n    }\n": types.CreatePostDocument,
    "\n    mutation DeleteComment($id: Int!) {\n        deleteComment(id: $id) {\n            id\n            __typename\n        }\n    }\n": types.DeleteCommentDocument,
    "\n    mutation LikePost($postId: Int!) {\n        likePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n": types.LikePostDocument,
    "\n    mutation LogoutUser {\n        logout\n    }\n": types.LogoutUserDocument,
    "\n    mutation LoginUser($loginInput: LoginDtoInput!) {\n        login(loginInput: $loginInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n": types.LoginUserDocument,
    "\n    mutation RegisterUser($registerInput: RegisterDtoInput!) {\n        register(registerInput: $registerInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n": types.RegisterUserDocument,
    "\n    mutation UnlikePost($postId: Int!) {\n        unlikePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n": types.UnlikePostDocument,
    "\n    query GetCommentsByPostId($postId: Int!) {\n        commentsByPostId(postId: $postId) {\n            id\n            text\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n": types.GetCommentsByPostIdDocument,
    "\n    query GetPostById($id: Int!) {\n        postById(id: $id) {\n            post {\n      id\n            text\n            video\n            createdAt\n            user {\n                id\n                fullName\n                email\n                image\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n            \n    }\n    \n    otherPostIds\n        }\n    }\n": types.GetPostByIdDocument,
    "\n    query GetPosts($skip: Int!, $take: Int!) {\n        posts(skip: $skip, take: $take) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n        }\n    }\n": types.GetPostsDocument,
    "\n    query GetPostsByUserId($userId: Int!) {\n        postsByUserId(userId: $userId) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n        }\n    }\n": types.GetPostsByUserIdDocument,
    "\nquery GetUsers {\n    users {\n        id\n        fullName\n        email\n        image\n    }\n}": types.GetUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateComment($postId: Int!, $text: String!) {\n        createComment(postId: $postId, text: $text) {\n            text\n            id\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateComment($postId: Int!, $text: String!) {\n        createComment(postId: $postId, text: $text) {\n            text\n            id\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreatePost($text: String!, $video: Upload!) {\n        createPost(text: $text, video: $video) {\n           id\n           text\n           video \n        }\n    }\n"): (typeof documents)["\n    mutation CreatePost($text: String!, $video: Upload!) {\n        createPost(text: $text, video: $video) {\n           id\n           text\n           video \n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteComment($id: Int!) {\n        deleteComment(id: $id) {\n            id\n            __typename\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteComment($id: Int!) {\n        deleteComment(id: $id) {\n            id\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LikePost($postId: Int!) {\n        likePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n"): (typeof documents)["\n    mutation LikePost($postId: Int!) {\n        likePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LogoutUser {\n        logout\n    }\n"): (typeof documents)["\n    mutation LogoutUser {\n        logout\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LoginUser($loginInput: LoginDtoInput!) {\n        login(loginInput: $loginInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation LoginUser($loginInput: LoginDtoInput!) {\n        login(loginInput: $loginInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RegisterUser($registerInput: RegisterDtoInput!) {\n        register(registerInput: $registerInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterUser($registerInput: RegisterDtoInput!) {\n        register(registerInput: $registerInput) {\n            user {\n                id\n                email\n                fullName\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UnlikePost($postId: Int!) {\n        unlikePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n"): (typeof documents)["\n    mutation UnlikePost($postId: Int!) {\n        unlikePost(postId: $postId) {\n            id\n            userId\n            postId\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCommentsByPostId($postId: Int!) {\n        commentsByPostId(postId: $postId) {\n            id\n            text\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetCommentsByPostId($postId: Int!) {\n        commentsByPostId(postId: $postId) {\n            id\n            text\n            createdAt\n            user {\n                id\n                fullName\n                email\n            }\n            post {\n                id\n                text\n                video\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPostById($id: Int!) {\n        postById(id: $id) {\n            post {\n      id\n            text\n            video\n            createdAt\n            user {\n                id\n                fullName\n                email\n                image\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n            \n    }\n    \n    otherPostIds\n        }\n    }\n"): (typeof documents)["\n    query GetPostById($id: Int!) {\n        postById(id: $id) {\n            post {\n      id\n            text\n            video\n            createdAt\n            user {\n                id\n                fullName\n                email\n                image\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n            \n    }\n    \n    otherPostIds\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPosts($skip: Int!, $take: Int!) {\n        posts(skip: $skip, take: $take) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetPosts($skip: Int!, $take: Int!) {\n        posts(skip: $skip, take: $take) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n            likes {\n                id\n                userId\n                postId\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPostsByUserId($userId: Int!) {\n        postsByUserId(userId: $userId) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetPostsByUserId($userId: Int!) {\n        postsByUserId(userId: $userId) {\n            id\n            text\n            video\n            user {\n                id\n                fullName\n                email\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetUsers {\n    users {\n        id\n        fullName\n        email\n        image\n    }\n}"): (typeof documents)["\nquery GetUsers {\n    users {\n        id\n        fullName\n        email\n        image\n    }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;