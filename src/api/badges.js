const jws = require('jws');
const fs = require('fs');
const uuid = require('uuid/v4');
const pngitxt = require('png-itxt');

const IssuerKeysCreator = require('./../../src/services/issuer-keys-creator');
const BadgeCreator = require('./../../src/services/badge-creator');
const Mail = require("./../../src/services/mail");

//const privateKey = fs.readFileSync(__dirname + '/../../keys/private-key.pem');
//const publicKey = fs.readFileSync(__dirname + '/../../keys/public-key.pem');

module.exports = (app, db, config) => {
    const issuerKeysCreator = new IssuerKeysCreator(__dirname + '/../../data/keys');

    app.post('/badge', (req, res) => {
        if (!req.body.username || !req.body.mail) {
            return res.status(403).json({ message: 'Forbidden.' });
        }

        if (!req.body.name || !req.body.description || !req.body.criteria || !req.body.recipient || !req.body.image) {
            return res.status(422).json({ message: 'Need name, description, criteria, recipient and image hash.' });
        }

        if (req.body.mail === req.body.recipient) {
            return res.status(422).json({ message: 'Recipient cannot be the same of issuer.' });
        }

        db.issuers.findOne({ username: req.body.username }, (error, issuer) => {
            if (error) {
                return res.status(500).json({ message: String(error) });
            }

            if (!issuer) {
                issuerKeysCreator.createForIssuer(req.body.username);
                db.issuers.insert({
                    username: req.body.username,
                    fullname: req.body.fullname,
                    email: req.body.mail
                });
            }

            const badge = {
                _id: uuid(),
                recipient: req.body.recipient,
                issuer: req.body.username,
                name: req.body.name,
                description: req.body.description,
                criteria: req.body.criteria,
                image: req.body.image,
                createdAt: new Date()
            };

            db.badges.insert(badge, (error, doc) => {
                if (error) {
                    return res.status(500).json({ message: String(error) });
                }

                Mail.send(badge, config);

                res.json(doc);
            });
        });
    });

    app.get('/badges', (req, res) => {
        if (!req.body.email && !req.query.email) {
            return res.status(403).json({ message: 'Forbidden.' });
        }

        let recipient = req.body.email;
        if (req.query.email) {
            recipient = req.query.email;
        }

        db.badges.find({ recipient }).sort({ createdAt: -1 }).exec((err, badges) => {
            res.json({ badges: badges || [] });
        });
    });

    app.get('/badge/:id', (req, res) => {
        db.badges.findOne({ _id: req.params.id }, (err, badge) => {
            if (!badge) {
                return res.status(404).json({ message: 'Not found.' });
            }

            const assertion = {
                "@context": 'https://w3id.org/openbadges/v2',
                id: 'urn:uuid:' + badge._id,
                type: 'Assertion',
                recipient: {
                    type: 'email',
                    identity: badge.recipient,
                    hashed: false,
                },
                verification: {
                    type: 'SignedBadge',
                    creator: `${config.host}/issuer/${badge.issuer}/public`,
                },
                badge: {
                    type: 'BadgeClass',
                    name: badge.name,
                    description: badge.description,
                    image: `${config.host}/badge/${badge._id}`,
                    criteria: {
                        narrative: badge.criteria
                    },
                    issuer: `${config.host}/issuer/${badge.issuer}`
                },
                issuedOn: badge.createdAt
            };

            const privateKey = fs.readFileSync(`${__dirname}/../../data/keys/${badge.issuer}/private-key.pem`);
            const signature = jws.sign({
        		header: { alg: 'RS256' },
        		payload: assertion,
        		privateKey: privateKey
        	});

            const buffer = new Buffer(badge.image, 'base64');
            const text = buffer.toString('utf-8');
            const badgeCreator = new BadgeCreator();

            badgeCreator.drawBadge(JSON.parse(text), (error, canvas) => {
                if (error) {
                    return res.status(500).json({ message: String(error) });
                }

                const stream = canvas.createPNGStream();

                res.set('Content-Type', 'image/png');
                res.set('Content-Disposition', `attachment; filename=${badge._id}.png`);

                stream.pipe(pngitxt.set({
                      type: 'iTXt',
                      keyword: 'openbadges',
                      compressed: false,
                      compression_type: 0,
                      language: '',
                      translated: '',
                      value: signature
                  }))
                  .pipe(res.original);
            });
        });
    });

    app.get('/badge/image/:hash(.+)', (req, res) => {
        const buffer = new Buffer(req.params.hash, 'base64');
        const text = buffer.toString('utf-8');
        const badgeCreator = new BadgeCreator();

        badgeCreator.drawBadge(JSON.parse(text), (error, canvas) => {
            if (error) {
                return res.status(500).json({ message: String(error) });
            }

            const stream = canvas.createPNGStream();

            res.set('Content-Type', 'image/png');
            stream.pipe(res.original);
        });
    });

    app.get('/badges/templates', (req, res) => {
        fs.readdir(`${__dirname}/../../public/templates`, (error, files) => {
            if (error) {
                return res.status(500).json({ message: String(error) });
            }

            res.json(files);
        });
    });
};
