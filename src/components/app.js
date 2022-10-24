import React, {Component} from 'react';
import Nav from './nav';
import Dashboard from './dashboard';
import BadgeCreator from './badge-creator';

class App extends Component {
    constructor() {
        super();

        this.state = {
            isCreatingBadge: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({ isCreatingBadge: !state.isCreatingBadge }));
    }

    handleSubmit(event) {
        event.preventDefault();
        window.location = `/?email=${event.target.elements.email.value}`;
    }

    render() {
        return (
            <div role="main">
                <Nav/>

                <section className="container mt-4">
                    {!this.state.isCreatingBadge &&
                        <div>
                            <nav className="d-flex mb-4">
                                <button className="ml-auto btn btn-success" type="button" onClick={this.handleClick}>
                                    Créer une médaille !
                                </button>
                            </nav>

                            <section className="jumbotron">
                                <h1>Tu veux une médaille ?</h1>
                                <p>Le site qui permet de créer des médailles pour les personnes méritantes (ou pas !).</p>
                                <br/>
                                <p>Médaille compatible OpenBadge 2.0 <a target="_blank" href="https://openbadges.org/">En savoir plus</a></p>

                                <p>Compatible avec les portefeuilles de badges :</p>
                                <ul>
                                    <li><a target="_blank" href="https://backpack.openbadges.org/">Mozilla Backpack</a></li>
                                    <li><a target="_blank" href="https://eu.badgr.com">Badgr</a></li>
                                    <li><a target="_blank" href="https://www.openbadgepassport.com/">Open Badge Passport</a></li>
                                </ul>

                                <hr/>
                                <h4>Retrouver mes médailles</h4>
                                <form className="form-inline" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input className="form-control" placeholder="Mon E-mail" name="email" type="email" required/>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Chercher</button>
                                </form>
                            </section>
                        </div>
                    }

                    {this.state.isCreatingBadge &&
                    <nav className="d-flex">
                        <button className="ml-auto btn btn-warning" onClick={this.handleClick}>Annuler</button>
                    </nav>
                    }

                    {!this.state.isCreatingBadge &&
                    <Dashboard/>
                    }

                    {this.state.isCreatingBadge &&
                    <BadgeCreator/>
                    }
                </section>
            </div>
        );
    }
}

export default App;
