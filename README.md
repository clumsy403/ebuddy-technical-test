# eBuddy Technical Test

## Folder Structure
```
├── apps
│   ├── backend-repo
│   │   ├── bun.lockb
│   │   ├── credentials.json
│   │   ├── firebase-debug.log
│   │   ├── firebase.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   └── tsconfig.json
│   └── frontend-repo
│       ├── bun.lockb
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── next-env.d.ts
│       ├── package.json
│       ├── public
│       ├── README.md
│       ├── src
│       └── tsconfig.json
├── bun.lockb
├── package.json
├── package-lock.json
├── packages
│   ├── eslint-config
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── package.json
│   │   ├── react-internal.js
│   │   └── README.md
│   ├── shared-types
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   ├── typescript-config
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── package.json
│   │   └── react-library.json
│   └── ui
│       ├── eslint.config.mjs
│       ├── package.json
│       ├── src
│       ├── tsconfig.json
│       └── turbo
├── README.md
└── turbo.json

```

## How to Run Turborepo
1. Run `npm install`
2. For dev, run `npm run dev`
3. For building, run `npm run build`


## How to run Backend Repo on Firebase
1. Navigate to the backend repo folder (`cd apps/backend-repo`)
2. Run the command `npm run serve`. This would build the backend repository and run the Firebase emulator. The server would be accessible at `http://127.0.0.1:5001/ebuddy-technical-test-e1ad6/us-central1/api`.

