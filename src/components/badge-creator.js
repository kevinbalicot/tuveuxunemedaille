import React, { Component } from 'react';

class BadgeCreator extends Component {
    constructor() {
        super();

        this.state = {
            icons: [],
            templates: [],
            image: null,
            error: null,
            success: null,
            name: '',
            description: '',
            criteria: '',
            username: 'tuveuxunemedaille',
            fullname: 'Tu veux une médaille',
            mail: 'noreply@tuveuxunemedaille.fr',
            icon: null,
            iconColor: '#000000',
            fill: '#ffffff',
            stroke: '#000000',
            displayExtra: 0,
            extraAlpha: 0.2,
            displayBanner: 1,
            bannerFill: '#ffffff',
            bannerStroke: '#000000',
            bannerText: 'Hello world!'
        };

        this.timer = null;
        this.handleSubmitBadgeCreator = this.handleSubmitBadgeCreator.bind(this);
        this.handleSubmitBadge = this.handleSubmitBadge.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTemplateChanged = this.handleTemplateChanged.bind(this);

        fetch('/icons').then(response => response.json()).then(data => {
            const icons = [];
            for (var categoryName in data) {
                for (var image of data[categoryName]) {
                    icons.push({ value: `/${categoryName}/${image}`, text: `${image} [${categoryName}]` });
                }
            }

            this.setState({ icons });
            this.setState({ image: '/badge/image/' + this.toBase64() });
        });

        fetch('/badges/templates').then(response => response.json()).then(data => {
            this.setState({ templates: data.map(template => template.replace('.json', '')) });
        });
    }

    handleChange(event) {
        clearTimeout(this.timer);

        const data = {};
        if (event.target.type === 'checkbox') {
            data[event.target.name] = event.target.checked;
        } else {
            data[event.target.name] = event.target.value;
        }

        this.setState(data);
        this.timer = setTimeout(() => this.setState({ image: '/badge/image/' + this.toBase64() }), 100);
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleTemplateChanged(event) {
        if (event.target.value) {
            fetch(`/templates/${event.target.value}.json`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        icon: data.image.icon,
                        iconColor: data.image.iconColor,
                        fill: data.image.fill,
                        stroke: data.image.stroke,
                        displayExtra: data.image.displayExtra,
                        extraAlpha: data.image.extraAlpha,
                        displayBanner: data.image.displayBanner,
                        bannerFill: data.image.bannerFill,
                        bannerStroke: data.image.bannerStroke,
                        bannerText: data.image.bannerText,
                        name: data.info.name,
                        description: data.info.description,
                        criteria: data.info.criteria
                    });

                    this.setState({ image: '/badge/image/' + this.toBase64() });
                });
        }
    }

    handleSubmitBadgeCreator(event) {
        event.preventDefault();

        this.setState({ image: '/badge/image/' + this.toBase64() });
    }

    handleSubmitBadge(event) {
        event.preventDefault();

        this.setState({ error: null, success: null });

        const inputs = event.target.elements;
        const formData = new FormData();

        formData.append('name', inputs['badge-name'].value);
        formData.append('description', inputs['badge-description'].value);
        formData.append('criteria', inputs['badge-criteria'].value);
        formData.append('recipient', inputs['badge-recipient'].value);

        formData.append('username', inputs['badge-issuer-username'].value);
        formData.append('fullname', inputs['badge-issuer-fullname'].value);
        formData.append('mail', inputs['badge-issuer-mail'].value);

        formData.append('image', this.toBase64());

        const options = {
            method: 'post',
            body: formData,
        };

        fetch('/badge', options)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    return this.setState({ error: data.message });
                }

                this.setState({ success: data });
            });
    }

    toBase64() {
        return btoa(JSON.stringify({
            icon: this.state.icon ||this.state.icons[0].value,
            iconColor: this.state.iconColor,
            fill: this.state.fill,
            stroke: this.state.stroke,
            displayExtra: this.state.displayExtra ? 1 : 0,
            extraAlpha: parseFloat(this.state.extraAlpha),
            displayBanner: this.state.displayBanner ? 1 : 0,
            bannerFill: this.state.bannerFill,
            bannerStroke: this.state.bannerStroke,
            bannerText: this.state.bannerText
        }));
    }

    render() {
        return (
            <div className="row">
                <div className="col-4">
                    { this.state.image && <img className="position-fixed" src={ this.state.image } /> }
                </div>

                <div className="col-8">
                    <nav className="card mt-4 mb-4 d-none">
                        <form className="card-body">
                            <p>💡 Vous pouvez créer un badge depuis un modèle de la liste suivante :</p>

                            <div className="form-group">
                                <label for="badge-icon">Modèle de badge</label>
                                <select className="custom-select" onChange={ this.handleTemplateChanged }>
<option value="" selected>Choisir un modèle ...</option>
                                    { this.state.templates.map((template) =>
                                        <option value={ template }>{ template }</option>
                                    )}
                                </select>
                            </div>
                        </form>
                    </nav>

                    <h3>🖍 Edition badge</h3>

                    <form onSubmit={ this.handleSubmitBadgeCreator }>
                        <div className="form-group">
                            <label for="badge-icon">Icone du badge</label>
                            <select className="custom-select"
                                id="badge-icon"
                                name="icon"
                                value={ this.state.icon }
                                onChange={ this.handleChange }
                            >
                            { this.state.icons.map((icon) =>
                                <option value={ icon.value }>{ icon.text }</option>
                            )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label for="badge-icon-color">Couleur de l'icone du badge</label>
                            <input className="form-control"
                                type="color"
                                id="badge-icon-color"
                                name="iconColor"
                                value={ this.state.iconColor }
                                onChange={ this.handleChange }
                                required="" />
                        </div>

                        <div className="form-group">
                            <label for="badge-fill">Couleur de fond du badge</label>
                            <input className="form-control"
                                type="color"
                                id="badge-fill"
                                name="fill"
                                value={ this.state.fill }
                                onChange={ this.handleChange }
                                required="" />
                        </div>

                        <div className="form-group">
                            <label for="badge-stroke">Couleur du trait du badge</label>
                            <input className="form-control"
                                type="color"
                                id="badge-stroke"
                                name="stroke"
                                value={ this.state.stroke }
                                onChange={ this.handleChange }
                                required="" />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox"
                                    id="display-extra-badge"
                                    className="custom-control-input"
                                    name="displayExtra"
                                    checked={ this.state.displayExtra }
                                    onChange={ this.handleChange } />
                                <label className="custom-control-label" for="display-extra-badge">Afficher un fond blanc</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label for="badge-extra-alpha">Opacité du fond blanc</label>
                            <input className="form-control"
                                type="number"
                                min="0.1"
                                max="1"
                                step="0.1"
                                id="badge-extra-alpha"
                                name="extraAlpha"
                                value={ this.state.extraAlpha }
                                onChange={ this.handleChange } />
                        </div>

                        <div className="form-group">
                            <label for="banner-fill">Couleur de fond de la banière</label>
                            <input className="form-control"
                                type="color"
                                id="banner-fill"
                                name="bannerFill"
                                value={ this.state.bannerFill }
                                onChange={ this.handleChange }
                                required="" />
                        </div>

                        <div className="form-group">
                            <label for="banner-stroke">Couleur du trait de la banière</label>
                            <input className="form-control"
                                type="color"
                                id="banner-stroke"
                                name="bannerStroke"
                                value={ this.state.bannerStroke }
                                onChange={ this.handleChange }
                                required="" />
                        </div>

                        <div className="form-group">
                            <label for="banner-text">Texte de la banière</label>
                            <input className="form-control"
                                type="text"
                                id="banner-text"
                                name="bannerText"
                                value={ this.state.bannerText }
                                onChange={ this.handleChange } />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox"
                                    id="display-banner"
                                    className="custom-control-input"
                                    name="displayBanner"
                                    checked={ this.state.displayBanner }
                                    onChange={ this.handleChange } />
                                <label className="custom-control-label" for="display-banner">Afficher une banière</label>
                            </div>
                        </div>

                        <button className="btn btn-primary" type="submit">Voir</button>
                    </form>

                    <h3 className="mt-4 mb-4">✉️ Informations du receveur</h3>

                    { this.state.error &&
                        <p className="alert alert-danger">{ this.state.error }</p>
                    }

                    { this.state.success &&
                        <p className="alert alert-success">
                            👌 Badge créé et disponible sur le profile de <a href={ '/?email=' + this.state.success.recipient }>{ this.state.success.recipient }</a>
                            <br/>
                            Vous pouvez le télécharger via le lien suivant <a href={ '/badge/' + this.state.success._id }>{ '/badge/' + this.state.success._id }</a>
                            <a className="d-block mt-4" href="/">Revenir à l'accueil</a>
                        </p>
                    }

                    <form className="badge-metadata mb-4" onSubmit={ this.handleSubmitBadge }>
                        <div className="form-group">
                            <label for="badge-name">
                                Nom du badge <span className="text-danger">*</span>
                            </label>

                            <input
                                onChange={ this.handleInputChange }
                                name="name"
                                className="form-control"
                                type="text"
                                id="badge-name"
                                required=""
                                value={ this.state.name }
                            />
                        </div>

                        <div className="form-group">
                            <label for="badge-description">
                                Description <span className="text-danger">*</span>
                            </label>

                            <input
                                onChange={ this.handleInputChange }
                                name="description"
                                className="form-control"
                                type="text"
                                id="badge-description"
                                required=""
                                value={ this.state.description }
                            />
                        </div>

                        <div className="form-group">
                            <label for="badge-criteria">
                                Critères (texte ou markdown) <span className="text-danger">*</span>
                            </label>

                            <textarea
                                onChange={ this.handleInputChange }
                                name="criteria"
                                id="badge-criteria"
                                rows="8"
                                cols="80"
                                className="form-control"
                                required=""
                                value={ this.state.criteria }>
                            </textarea>
                        </div>

                        <div className="form-group">
                            <label for="badge-recipient">
                                Email du receveur <span className="text-danger">*</span>
                            </label>

                            <input className="form-control" type="email" id="badge-recipient" required="" />
                        </div>

                        <h3 className="mt-4 mb-4">🖋 Informations de l'émetteur</h3>

                        <div className="form-group">
                            <label htmlFor="badge-issuer-username">
                                Pseudo <span className="text-danger">*</span>
                            </label>

                            <input
                                onChange={this.handleInputChange}
                                name="username"
                                className="form-control"
                                type="text"
                                id="badge-issuer-username"
                                required=""
                                value={this.state.username}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="badge-issuer-fullname">Nom complet</label>
                            <input
                                onChange={this.handleInputChange}
                                name="fullname"
                                className="form-control"
                                type="text"
                                id="badge-issuer-fullname"
                                value={this.state.fullname}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="badge-issuer-mail">
                                Email du l'émetteur <span className="text-danger">*</span>
                            </label>

                            <input
                                onChange={this.handleInputChange}
                                name="fullname"
                                className="form-control"
                                type="text"
                                id="badge-issuer-mail"
                                required=""
                                value={this.state.mail}
                            />
                        </div>

                        <button className="btn btn-success">Créer le badge</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default BadgeCreator;
