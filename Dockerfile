FROM node:18.18.0

RUN mkdir -p /home/js_server

WORKDIR  /home/js_server

COPY  . .

EXPOSE 3000

RUN npm install

RUN npm run build

RUN npx prisma generate

CMD [ "npm", "run", "start:prod" ]
