import pkg from '../../package.json';

export const environment = {
    production: true,
    name: pkg.name,
    version: pkg.version,
    requires: pkg.requires
};
