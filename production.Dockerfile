FROM node:10 as tuveuxunemedaille

WORKDIR /home/app

COPY . /home/app

RUN npm install
RUN npm run build

EXPOSE 9002

CMD ["npm", "start"]
