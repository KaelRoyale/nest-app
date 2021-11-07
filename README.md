
# NestJS 7 API project 

[![License](https://img.shields.io/github/license/saluki/nestjs-template.svg)](https://github.com/saluki/nestjs-template/blob/master/LICENSE)

Scaffold quickly your next [NestJS](https://nestjs.com/) API project

- Crafted for Docker environments (Dockerfile support and environment variables)
- REST API with [MongoDB](http://https://www.mongodb.com/) support 
- Swagger documentation, [Joi](https://github.com/hapijs/joi) validation
- Folder structure, code samples

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) and NPM
- A stable internet connection as it will try to connect to MongoDB Cloud Atlas

[Docker](https://www.docker.com/) may also be useful for advanced testing and image building, although it is not required for development.

### 1.2 Project configuration

Start by cloning this project on your workstation.

``` sh
https://github.com/KaelRoyale/nest-app.git
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./nest-app
npm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing your environment variables used for development.

```
cp .env.example .env
vi .env
```





Last but not least, define a `JWT_SECRET` to sign the JWT tokens or leave the default value in a development environment. Update the `JWT_ISSUER` to the correct value as set in the JWT. 



> In this project, JWT is configured with secret and expires time in .env

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── authen
│   ├── guards
│   ├── strategies
│   ├── constants
│   ├── dto
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
├── users
│   ├── dto
│   ├── users.schema
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts


└── main.ts
├── app.module.ts
```

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
npm run start

# Run the application using "ts-node"
npm run dev

# Transpile the TypeScript files
npm run build



## 4. Project goals

The goal of this project is to learning to buil RESTApi for authentication using NestJS Express

## 5. Roadmap

The following improvements are currently in progress : 

- [x] Configuration validation
- [x] Simple endpoints for authentication with JWT token
- [x] Project documentation
- [x] MongoDB migration support
- [ ] Dockerfile improvements and better usage of environment variables
- [ ] Conduct unit testing and integration testing
- [ ] Better logging configuration with environment variables
- [ ] Working further on refactoring code structures

## 6. Contributing

Feel free to suggest an improvement, report a bug, or ask something