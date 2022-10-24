const https = require('https');

class Mail {
    static send(badge, config) {
        const data = JSON.stringify({
            subject: 'On vous a décerné une médaille, félicitation :)',
            message: `
Félicitation, vous venez de recevoir une médaille !

Émetteur : ${badge.issuer}
Intitulé : ${badge.name}
Description : ${badge.description}

Téléchargez votre médaille => ${config.host}/badge/${badge._id}

Médaille compatible OpenBadge 2.0 (https://openbadges.org/)

Compatible avec les portefeuilles de badges :
    - Mozilla Backpack (https://backpack.openbadges.org/)
    - Badgr (https://eu.badgr.com)
    - Open Badge Passport (https://www.openbadgepassport.com/)

Vous pouvez retrouver toutes vos médailles sur le site ${config.host}?email=${badge.recipient}`,
            to: badge.recipient,
            from: 'noreply@tuveuxunemedaille.fr'
        });

        const options = {
            host: 'mailer.beaujeuteam.fr',
            path: '/mail/json',
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Content-Length' : Buffer.byteLength(data, 'utf8')
            }
        };

        const request = https.request(options, res => {
            res.setEncoding('utf8');
        });

        request.write(data);
        request.end();
    }
}

module.exports = Mail;
