import pkg from '../../package.json';

export const environment = {
    production: true,
    name: pkg.name,
    requires: pkg.requires
};
