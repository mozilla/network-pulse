var habitat = require(`habitat`);

// Local environment in .env overwrites everything else
habitat.load(`.env`);

var environment = habitat.get(`NODE_ENV`);

if (environment !== `PRODUCTION`) {
  // note that if you have any env var that is in both .env and .default.env,
  // the value in .env will always have the highest priority
  // (i.e., it will override the value of the var you have in default.env)
  habitat.load(`config/default.env`);
}

var config = {
  ORIGIN: habitat.get(`ORIGIN`),
  PULSE_API: habitat.get(`PULSE_API`)
};

process.stdout.write(
  `${JSON.stringify(config)}\n`
);
