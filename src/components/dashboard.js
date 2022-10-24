import React, { Component } from 'react';

class Dashboard extends Component {
    constructor() {
        super();

        const { search } = window.location;
        const match = search.match(/\?email=(.+)/);

        this.state = {
            badges: [],
            error: null,
            mail: match ? match[1] : null,
        };

        const options = {
            method: 'get',
        };

        if (this.state.mail) {
            fetch(`/badges?email=${this.state.mail}`, options)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        return this.setState({ error: data.message });
                    }

                    this.setState({ badges: data.badges });
                });
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.mail && <h3>Hello 👋</h3>
                }

                { this.state.error &&
                    <p className="alert alert-danger">{ this.state.error }</p>
                }

                { this.state.mail && !this.state.badges.length &&
                    <p className="alert alert-info mt-4">Vous n'avez pas de badges 😢.</p>
                }

                <div className="card-columns mt-4">
                    { this.state.badges.map((badge) =>
                        <div className="card mb-4">
                            <img src={ '/badge/' + badge._id } class="card-img-top p-4" alt={ badge._id } />
                            <div className="card-body">
                                <h5 className="card-title">{ badge.name }</h5>
                                <p className="card-text">{ badge.description }</p>
                                <a href={ '/badge/' + badge._id } className="btn btn-outline-primary">Télécharger</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Dashboard;
