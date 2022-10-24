const fs = require('fs');

module.exports = (app, db, config) => {
    app.get('/issuer/:username', (req, res) => {
        db.issuers.findOne({ username: req.params.username }, (error, issuer) => {
            if (error) {
                return res.status(500).json({ message: String(error) });
            }

            if (!issuer) {
                return res.status(404).json({ message: 'Not found.' });
            }

            const data = {
                '@context': 'https://w3id.org/openbadges/v2',
                type: 'Issuer',
                name: issuer.username,
                url: `${config.host}/issuer/${issuer.username}`,
                email: issuer.email,
                publicKey: `${config.host}/issuer/${issuer.username}/public`
            };

            res.set('Content-Type', 'application/ld+json').json(data);
        });
    });

    app.get('/issuer/:username/public', (req, res) => {
        const path = __dirname + `/../../data/keys/${req.params.username}/public-key.pem`;
        if (!fs.existsSync(path)) {
            return res.status(404).json({ message: 'Not found.' });
        }

        res.set('Content-Type', 'application/ld+json').json({
            '@context': 'https://w3id.org/openbadges/v2',
            type: 'CryptographicKey',
            owner: `${config.host}/issuer/${req.params.username}`,
            publicKeyPem: String(fs.readFileSync(path))
        });
    });
};
