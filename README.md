# React app to access GitHub API
This app is used to fetch GitHub profile information in order to view and edit repositories.

Currently it is only possible to edit repositories on an account with a token. The token can be placed in a .env file in the root folder during development.

.env content
```
REACT_APP_API_TOKEN={token}
```

The token is generated [here](https://github.com/settings/tokens)

## How to set up
```
git clone https://github.com/blackscalare/eghra.git
cd eghra
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
