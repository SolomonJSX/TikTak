import { CodegenConfig, generate } from '@graphql-codegen/cli';
import { baseGraphQlUrl } from './src/utils/apolloClient';


const config: CodegenConfig = {
    schema: baseGraphQlUrl,
    documents: 'src/graphql/**/*.ts',
    generates: {
        './src/gql/': {
            preset: 'client',
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo'
            ],
        },
    },
};

export default config;