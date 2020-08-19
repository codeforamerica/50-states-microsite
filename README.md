Microsite: Bring Social Safety Net Benefits Online
==================================================

This repository holds the code for the ['50 States' microsite](https://www.codeforamerica.org/features/bringing-social-safety-net-benefits-online).

## Who made this

The microsite was: 
* designed by Rachel Edelman (Designer, Code for America), 
* developed by @fritzjooste (Senior Front-end Developer and Designer, Code for America), 
* with data visualizations developed by [Kerry Rodden](http://www.kerryrodden.com/), 
* with additional development by @luigi (Principal Software Engineer, Code for America) 
* based on research and work done by the [Integrated Benefits](https://www.codeforamerica.org/programs/integrated-benefits) team at Code for America.

## Notes on the setup

* The data visualizations were built mainly using [D3](https://d3js.org/). 
* The microsite has stylesheets and Javascript files that live in the `src/` subdirectory that are compiled to `/dist` using Webpack.
* There are some static files that live in the `static/` subdirectory: images, CSV files, etc.

## Install and develop locally

1. Clone the repo.
1. Install all the node dependencies by running `yarn install` or `npm install`. Note: if developing on a Linux environment, you may need to run the command with the `--ignore-engines` flag, i.e. `yarn install --ignore-engines`
1. Start Webpack by running `yarn run webpack --watch` and leave that processes running.
1. In a separate terminal window, start the development server by running `yarn run webpack --watch`. The site should now be served at `localhost:9000`.
