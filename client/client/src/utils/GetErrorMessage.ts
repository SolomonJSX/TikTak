import { GraphQLFormattedError } from "graphql/index";

export function getErrorMessage(error: GraphQLFormattedError) {

  return ({
    [error.path?.[2] as string]: error.message
  })
}