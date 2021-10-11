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
            repository:null,
            errors:null
        }
    }

    resolveIssuesQuery = ( { data } ) => ({
        organization: data?.data?.organization,
        repository: data?.data?.organization?.repository,
        errors: data?.errors
    })
    
    onFetchFromGitHub = () =>
    {
        const { path } = this.state;
        const [ organization, repository ] = path.split( '/' );
        
        axiosGitHubGraphQL
            .post( '', { query: GET_ISSUES_OF_REPOSITORY, variables: { organization, repository } } )
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
    
    render () {
        const { path, organization, errors,repository } = this.state;
        
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
                        repository={ repository }
                        errors={ errors } /> :
                    <p> No Information yet.</p>
                }
            </div>
        );
    }
}

const GET_ISSUES_OF_REPOSITORY = `
query($organization: String!, $repository: String!) {
    organization(login: $organization) {
        name
        url
        repository(name: $repository) {
            name
            url
            issues(last: 5) {
                edges {
                    node {
                        id
                        title
                        url
                    }
                }
            }
        }
    }
}`

export default App;
