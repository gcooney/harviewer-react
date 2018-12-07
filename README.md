# harviewer-react

harviewer-react is [HAR Viewer](https://github.com/janodvarko/harviewer)
implemented in [React](https://facebook.github.io/react/)!

Use it at [https://gitgrimbo.github.io/harviewer-react/](https://gitgrimbo.github.io/harviewer-react/).

# Develop

I use [Visual Studio Code](https://code.visualstudio.com).

# Running the code

harviewer-react uses [webpack](https://webpack.github.io/).

## Setup

Using [npm](https://www.npmjs.com/), pull in the required packages with:

    npm install

## Start

To start the [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html), use:

    npm start

The Demo Shell will now be available at:

- http://localhost:8080/webapp/demos/demo-shell.html

And the main app will be available at:

- http://localhost:8080/webapp/

# Deploy

    npm run deploy-gh-pages

This will build the production version of harviewer-react and deploy it as a
[GitHub pages](https://pages.github.com/) site.
