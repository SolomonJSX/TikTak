import {
    ApolloClient,
    ApolloLink,
    gql, InMemoryCache, NormalizedCacheObject, Observable, useMutation,
    useQuery
} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

export const baseGraphQlUrl = "http://localhost:5079/graphql";

interface IAccessToken {
    refreshToken?: string;
}

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
    try {
        const { data } = await client.mutate<IAccessToken>({
            mutation: gql`
                mutation RefreshToken {
                    accessToken
                }
            `
        });
        const newAccessToken = data?.refreshToken;

        if (!newAccessToken) {
            throw new Error("New access token not received.");
        }

        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));

        return `Bearer ${newAccessToken}`;
    } catch (err) {
        throw new Error("Error getting accessToken");
    }
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    let retryCount = 0;
    const maxRetry = 3;

    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.extensions && err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
                retryCount++;
                return new Observable(observer => {
                    refreshToken(client)
                    .then((accessToken) => {
                        const oldHeaders = operation.getContext().headers;
                        operation.setContext({
                            headers: {
                                ...oldHeaders,
                                authorization: accessToken,
                            }
                        });
                        const forward$ = forward(operation);
                        return forward$.subscribe(observer)
                    })
                });
            }
        }
    }

});

const uploadLink = createUploadLink({
    uri: baseGraphQlUrl,
    credentials: "include",
    headers: {
        "apollo-require-preflight": "true",
    },
})

const client = new ApolloClient({
    uri: baseGraphQlUrl,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getCommentsByPostId: {
                        merge(_, incoming) {
                            return incoming;
                        }
                    }
                }
            }
        }
    }),
    credentials: "include",
    headers: {
        "content-type": "application/json",
    },
    link: ApolloLink.from([errorLink, uploadLink]),
});