const fs = require('fs');
const child = require('child_process');

class IssuerKeysCreator {
    constructor(keysPath) {
        this.keysPath = keysPath;
    }

    createForIssuer(username) {
        if (!fs.existsSync(`${this.keysPath}/${username}`)) {
            fs.mkdirSync(`${this.keysPath}/${username}`);
        }

        return this._generateKey(`${this.keysPath}/${username}`);
    }

    _generateKey(path) {
        return new Promise((resolve, reject) => {
            child.exec(`openssl genrsa -out ${path}/private-key.pem 2048`, error => {
                if (error) {
                    return reject(error);
                }

                child.exec(`openssl rsa -in ${path}/private-key.pem -pubout -out ${path}/public-key.pem`, error => {
                    if (error) {
                        return reject(error);
                    }

                    resolve();
                });
            });
        });
    }
}

module.exports = IssuerKeysCreator;
