FROM node:12.19.0-alpine3.9 AS development
RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install glob rimraf
# uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# install the bcrypt modules for the machine
RUN npm install bcrypt

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:12.19.0-alpine3.9 as production
RUN apk --no-cache add --virtual builds-deps build-base python 
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./



COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]