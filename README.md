# CCR3 Onesource AppEU (End User application)

## 1. Installation

### 1.1. Create env variables
Create a local .env.local environment file making sure it contains the same parameters as the [.env](.env) template.

### 1.2. Dependencies installation
```bash
yarn install
```

## 2. Compiling and Serving

### 2.1. Compile and hot-reloads for development

```bash
yarn serve
```

Alternatively, the Docker Stack can be used to run a specific Container for this project. Run the following command from the docker project root:

```bash
orbit run app-eu
```

### 2.2. Replicating Production Server

We are using Vue Server Side Rendering (Vue SSR). For this reason, to render the app with SSR the following commands need to be run:
 
```bash
yarn build & yarn start
```
