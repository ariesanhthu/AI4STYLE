# Guide running this project

## Install packages
Before running the project for the first time, you need to install the required packages for both the backend and frontend services.
### Backend
Go to the `src/backend` directory and run:
```bash
npm install
```

### Frontend
Go to the `src/frontend` directory and run:
```bash
npm install
```

## Docker
At the first time running this project or installing new packages. 

Go to the project root directory and run:
```bash
docker-compose up -d --build
```

It will build and start both the backend and frontend services. This setup is used for development purposes. So it has hot reloading enabled for both services (Changing code will directly update services). 

After the first time, you can simply run:
```bash
docker-compose up -d
```

## Accessing the application
Once the services are up and running, you can access:
- The frontend application by navigating to `http://localhost:3000`.
- The backend API by navigating to `http://localhost:3001/swagger`.


# Project Directory Structure
```bash
/
├─ src/                           # source code
├─ docs/                          # documentation
│  ├─ management/                 # planning docs, weekly/status reports, etc.
│  ├─ requirements/               # vision document, use cases, all requirements
│  ├─ analysis and design/        # architecture doc, UML models, UI design
│  └─ test/                       # test plan, test cases, test reports
└─ pa/                            # submissions; each subfolder is one PA submission
   ├─ <PA01>/
   └─ <PA02>/
```


dev mode:
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml up