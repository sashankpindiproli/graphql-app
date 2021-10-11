import React, { Component } from 'react';
import axios from 'axios';
import Organization from './Organization';

const TITLE = 'React GraphQL GitHub Client';
const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

class App extends Component
{
    constructor (props) { 
        super( props );
        this.state = {
            path: 'the-road-to-learn-react/the-road-to-learn-react',
            organization: null,
            errors:null
        }
    }

    resolveIssuesQuery = ( { data } ) => ({
        organization: data?.data?.organization,
        errors: data?.errors
    })
    
    resolveViewerHasStarred = ( { data }) =>
    {
        const viewerHasStarred = data?.addStar?.starrable?.viewerHasStarred;
        
        return {
            ...this.state,
            organization: {
                ...this.state.organization,
                    repository:
                {
                        ...this.state.organization?.repository,
                    stargazerCount:viewerHasStarred ? this.state.organization?.repository?.stargazerCount + 1 : this.state.organization?.repository?.stargazerCount - 1,
                    viewerHasStarred
                }
            }
        }
    }
    
    onFetchFromGitHub = (cursor=null) =>
    {
        const { path } = this.state;
        const [ organization, repositoryName ] = path.split( '/' );
        
        axiosGitHubGraphQL
            .post( '', { query: GET_ISSUES_OF_REPOSITORY, variables: { organization, repositoryName, cursor } } )
            .then( ( { data } ) =>
            {
                this.setState(this.resolveIssuesQuery({data}));
            });
    };

    
    componentDidMount () {
         // fetch data when component instantiates
        this.onFetchFromGitHub();
    }

    onChange = event => {
        this.setState( { path: event.target.value } );
    };
    
    onSubmit = event => {
        event.preventDefault();
        this.onFetchFromGitHub();
    };
    
    onFetchMoreIssues = () => {
        const { organization } = this.state;
        const endCursor = organization?.repository?.issues?.pageInfo?.endCursor;
        this.onFetchFromGitHub( endCursor )
    }

    handleRepositoryCall = ( viewerHasStarred ) => viewerHasStarred ? REMOVE_STAR_FROM_REPOSITORY : ADD_STAR_TO_REPOSITORY;

    onRepositoryStar = (id, viewerHasStarred) => {
        axiosGitHubGraphQL
            .post( '', { query: this.handleRepositoryCall(viewerHasStarred), variables: { repositoryId:id } } )
            .then( ( { data }) => this.setState( this.resolveViewerHasStarred( data ) ));
    }
    render () {
        const { path, organization, errors } = this.state; 
        return (
            <div>
                <h1>{ TITLE }</h1>
                <form onSubmit={ this.onSubmit.bind(this) }>
                    <label htmlFor="url">
                        Show open issues for https://github.com
                    </label>
                    <input id="url" value={path} type="text" onChange={ (inputEvent) => this.onChange(inputEvent) } style={ { width: '300px' } } />
                    <button type="submit">Submit</button>
                </form>
                <hr />
                {organization ?
                    <Organization
                        organization={ organization }
                        onFetchMoreIssues={ this.onFetchMoreIssues.bind( this ) }
                        onRepositoryStar={ this.onRepositoryStar.bind(this) }
                        errors={ errors } /> :
                    <p> No Information yet.</p>
                }
            </div>
        );
    }
}

const GET_ISSUES_OF_REPOSITORY = `
query($organization: String!, $repositoryName: String!, $cursor: String) {
    organization(login: $organization) {
        name
        url
        repository(name: $repositoryName) {
            id
            name
            url
            viewerHasStarred
            stargazerCount
            issues(last: 5, after: $cursor, states: [OPEN]) {
                edges {
                    node {
                        id
                        title
                        url
                        reactions(last: 3) {
                            edges {
                                node {
                                    id
                                    content
                                }
                            }
                        }
                    }
                }
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
}`

const ADD_STAR_TO_REPOSITORY = `
    mutation($repositoryId: ID!) {
        addStar(input: {starrableId: $repositoryId}) {
            starrable {
                viewerHasStarred
            }
        }
    }
`;


const REMOVE_STAR_FROM_REPOSITORY = `
    mutation($repositoryId: ID!) {
        removeStar(input: {starrableId: $repositoryId}) {
            starrable {
                viewerHasStarred
            }
        }
    }
`;

export default App;
