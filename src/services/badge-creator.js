const fs = require('fs');
const { createCanvas, Image } = require('canvas')

class BadgeCreator {
    constructor(width = 200, height = 200) {
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
    }

    drawBadge(
        {
            icon,
            iconColor,
            fill,
            stroke,
            displayExtra,
            extraAlpha,
            displayBanner,
            bannerFill,
            bannerStroke,
            bannerText
        },
        callback
    ) {
        this.drawCircle(stroke, fill, displayExtra, extraAlpha);
        this.drawIcon(icon, iconColor)
            .then(() => {
                if (displayBanner) {
                    this.drawBanner(bannerText, bannerStroke, bannerFill);
                }

                callback(null, this.canvas);
            })
            .catch(error => callback(error, null));
    }

    drawCircle(strokeColor = '#000', fillColor = null, extra = false, alpha = 0.2) {
        let radius = Math.round((this.canvas.height / 2) * 0.9);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 20;
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, 360);
        this.ctx.stroke();

        if (null !== fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        this.ctx.closePath();
        this.ctx.restore();

        if (extra) {
            radius = Math.round((this.canvas.height / 2) * 0.7);

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.globalAlpha = alpha;
            this.ctx.lineWidth = 20;
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, 360);

            this.ctx.fillStyle = '#fff';
            this.ctx.fill();

            this.ctx.closePath();
            this.ctx.restore();
        }
    }

    drawBanner(text, strokeColor = '#000', fillColor = '#fff') {
        const bannerWidth = this.canvas.width * .8;
        const bannerHeight = 50;
        const margin = (this.canvas.width - bannerWidth) / 2

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 10;
        this.ctx.rect(5, this.canvas.height - bannerHeight - 5, bannerWidth / 5, bannerHeight);
        this.ctx.stroke();

        if (null !== fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        this.ctx.closePath();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 10;
        this.ctx.rect(this.canvas.width - (bannerWidth / 5) - 5, this.canvas.height - bannerHeight - 5, bannerWidth / 5, bannerHeight);
        this.ctx.stroke();

        if (null !== fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        this.ctx.closePath();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 10;
        this.ctx.rect(margin, this.canvas.height - bannerHeight - 15, bannerWidth, bannerHeight);

        this.ctx.stroke();

        if (null !== fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        this.ctx.font = '20px Impact';
        this.ctx.fillStyle = strokeColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, this.canvas.width / 2, (this.canvas.height - bannerHeight - 15) + bannerHeight / 2);

        this.ctx.closePath();
        this.ctx.restore();
    }

    drawIcon(icon, color = '#000') {
        return new Promise((resolve, reject) => {
            fs.readFile(`${__dirname}/../../public/svgs/${icon}`, 'utf-8', (error, svg) => {
                if (error) {
                    return reject(error);
                }

                const image = new Image();
                image.onload = () => {
                    this.ctx.drawImage(image, this.canvas.width / 4, this.canvas.height / 4);
                    resolve();
                };

                image.onerror = error => reject(error);

                svg = svg.replace('<svg', `<svg width="${this.canvas.width / 2}" height="${this.canvas.height / 2}"`);
                svg = svg.replace('<path', `<path fill="${color}"`);

                image.src = Buffer.from(svg, 'utf-8');
            });
        });
    }
}

module.exports = BadgeCreator;
