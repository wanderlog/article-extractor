// utils -> findExtension

const {
  readdirSync,
} = require('fs');

const {
  extname,
  join,
} = require('path');

const {
  isObject,
  isArray,
  isFunction,
} = require('bellajs');

const extDir = '../parsers/extensions';
const extensions = [];

readdirSync(join(__dirname, extDir)).forEach((file) => {
  if (extname(file) === '.js') {
    const ext = require(`${extDir}/${file}`);
    if (isObject(ext) && isFunction(ext.extract) && isArray(ext.schemes)) {
      extensions.push(ext);
    }
  }
});

const extFinder = (url, providers) => {
  const candidates = providers.filter((provider) => {
    const {
      schemes,
    } = provider;

    return schemes.some((scheme) => {
      const reg = new RegExp(scheme.replace(/\*/g, '(.*)'), 'i');
      return url.match(reg);
    });
  });
  return candidates.length > 0 ? candidates[0] : null;
};

const findExtension = (url) => {
  return extFinder(url, extensions);
};

module.exports = findExtension;
