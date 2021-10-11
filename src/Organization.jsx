import React, { Component } from 'react';
import Repository from './Repository';

class Organization extends Component {
    
    render () {
        const { organization: { name, url, repository }, errors, onFetchMoreIssues, onRepositoryStar }= this.props
        if (errors) {
            return (
                <p>
                    <strong> Something went wrong </strong>
                    {errors.map(error => error.message).join(' ')}
                </p>
            )
        }
        return (
            <div>
                <p>
                    <strong> Issues from Organization: </strong>
                    <a href={ url }>{ name }</a>
                </p>
                <Repository
                    repository={ repository }
                    onFetchMoreIssues={ onFetchMoreIssues }
                    onRepositoryStar={ onRepositoryStar }
                />
            </div >
        ); 
    }  
}

export default Organization;
