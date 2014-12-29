var secrets = require("./../.secrets.json");
module.exports = {
  cookieSecret: secrets.cookieSecret,
  sessionSecret: secrets.sessionSecret
};
