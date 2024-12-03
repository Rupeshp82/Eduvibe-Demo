FROM node:20

WORKDIR /Eduvibe_container

COPY . .

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000