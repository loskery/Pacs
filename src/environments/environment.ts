// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    api_url: 'https://conduit.productionready.io/api',
    // api_url_QNU: 'http://servervienkhcn/qnuadmin/',
    // api_url_ris: 'http://servervienkhcn/qnris/'
    api_url_QNU: 'http://localhost:8080/qnuadmin/',
    api_url_ris: 'http://localhost:8080/qnris/'
};

