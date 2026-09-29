# SAP CAP Application with OData

A small full-stack app for managing employee records that live in an SAP backend. The AngularJS frontend talks to a Node.js/Express server, and the server forwards every create, read, update and delete call to an SAP Gateway OData V2 service.

## Features

- Login screen (checked in the browser only, meant as a demo gate rather than real authentication)
- Dashboard showing the number of records, the highest record ID, the number of distinct offices and whether the OData service answered
- Records table loaded live from the OData `RecordsSet` entity set
- Add, edit and delete records; for write requests the server first fetches an `X-CSRF-Token` from SAP Gateway and sends it back with the session cookies
- SAP service URL and credentials are read from environment variables

## Tech stack

- **Frontend:** AngularJS 1.8 with ngRoute, Bootstrap 5, Font Awesome, Animate.css and GSAP (loaded from CDNs)
- **Backend:** Node.js, Express, axios, dotenv
- **SAP:** SAP Gateway OData V2 service (`ZCAP_ODATA_SRV`), project set up with SAP CAP (`@sap/cds`) tooling

## How it works

```
Browser (AngularJS)  -->  Express /api/records  -->  SAP Gateway OData RecordsSet
```

| Method | Route              | OData request                                   |
|--------|--------------------|-------------------------------------------------|
| GET    | `/api/records`     | `GET RecordsSet`                                |
| GET    | `/api/records/:Id` | `GET RecordsSet(Id='...')`                      |
| POST   | `/api/records`     | `POST RecordsSet` (with CSRF token)             |
| PUT    | `/api/records/:Id` | `PUT RecordsSet(Id='...')` (with CSRF token)    |
| DELETE | `/api/records/:Id` | `DELETE RecordsSet(Id='...')` (with CSRF token) |

The entity set is expected to have a string key `Id` and the fields `Name`, `Location` and `Office`.

## Project structure

```
app/                  AngularJS frontend, served as static files
  app.js              module and routes
  login/              login view
  dashboard/          dashboard view and stats
  records/            list, add and edit views
  shared/sidebar.html navigation sidebar
srv/
  server.js           Express server, static hosting and /api routes
  dbService.js        OData calls to SAP Gateway
.env.example          template for the environment variables
```

## Setup

You need Node.js 18 or newer and access to an SAP system that exposes the OData service.

```bash
git clone https://github.com/Hamza-Tahirr/SAP-CAP-APPLICATION-WITH-ODATA.git
cd SAP-CAP-APPLICATION-WITH-ODATA
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable        | Description                                                        |
|-----------------|--------------------------------------------------------------------|
| `SAP_ODATA_URL` | Full URL of the entity set, e.g. `https://<host>:<port>/sap/opu/odata/sap/ZCAP_ODATA_SRV/RecordsSet` |
| `SAP_USER`      | SAP user with access to the service                                |
| `SAP_PASSWORD`  | Password of that user                                              |
| `PORT`          | Optional, defaults to `4004`                                       |

## Run

```bash
npm start
```

Then open http://localhost:4004. The demo login is defined in `app/login/login.js`.

## License

MIT, see [LICENSE](LICENSE).
