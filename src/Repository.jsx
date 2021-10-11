import React, { Component } from 'react';

class Repository extends Component {
    render () {
        
        const { repository: { id, name, url, issues,viewerHasStarred, stargazerCount }, onFetchMoreIssues, onRepositoryStar } = this.props;
        const hasNextPage = issues?.pageInfo?.hasNextPage;
        
        return (
            <div>
                <p>
                    <strong>In Repository:</strong>
                    <a href={url}>{name}</a>
                </p>
                <p>Star Count:{stargazerCount}</p>
                <button onClick={() => onRepositoryStar(id, viewerHasStarred)}>
                    {viewerHasStarred ? 'Unstar' : 'Star'}
                </button>
                <ul>
                    { issues?.edges?.map( ( { node: { id, title, url, reactions } } ) =>
                        <li key={ id }>
                            <a href={ url }>{ title }</a>
                            <ul key={ id }>
                                { reactions?.edges?.map( ( { node: { id, content } } ) => <li key={id}>{content}</li>)}
                            </ul>
                        </li> ) }
                </ul>
                <hr />
                {hasNextPage && <button onClick={ onFetchMoreIssues }>More</button> }
            </div>
        )
    }
}

export default Repository;
