var habitat = require(`habitat`);

// Local environment in .env overwrites everything else
habitat.load(`./.env`);

var environment = habitat.get(`NODE_ENV`);

if (environment !== `PRODUCTION`) {
  habitat.load(`./config/default.env`);
}

var config = {
  PULSE_API: habitat.get(`PULSE_API`)
};

process.stdout.write(
  `${JSON.stringify(config)}\n`
);
