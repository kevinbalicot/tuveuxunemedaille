FROM node:10

EXPOSE 8080

WORKDIR /var/www/openbadges

COPY . .

RUN ./bin/provision
RUN npm install --only=production

CMD [ "npm", "start" ]
