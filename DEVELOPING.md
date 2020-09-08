# Steps to build

> **warning**: commited `.env` in repository however in normal scneario it should not be commited

## Server (Backend)

### Prerequisite

- MongoDB URL or local instance required. Update `DATABASE` in `server/.env` is remote instance.
- Database is populated first time with new organisation and super user (this step only run once). If records exist in database nothing is inserted in database. Check `server/data/seed.js` for more details
- Valid [sendgrid](https://sendgrid.com/) api key required to send mails
- add send grid api in `server/.env` against property `SENDGRID_API_KEY`
- make rename `server/env.example` to `.env`

**Steps**

1. cd server
2. npm install

- `npm start` to start server on port `8000`
- `npm run test` to execute tests

## Client (Frontend)

**Steps**

1. cd client
2. npm install

- `npm start` to start server on port `8000`
- `npm run test` to execute tests
