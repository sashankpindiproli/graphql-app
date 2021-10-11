import React, { Component } from 'react';

class Repository extends Component {
    render () {
        
        const { name, url, issues } = this.props;
        return (
            <div>
                <p>
                    <strong>In Repository:</strong>
                    <a href={url}>{name}</a>
                </p>
                <ul>
                    { issues?.edges?.map( ( { node: { id, title, url } } ) => <li key={ id }><a href={url}>{title}</a></li>)}
                </ul>
            </div>
        )
    }
}

export default Repository;
