var dotenv = require(`dotenv`);

// load default.env
dotenv.config({path: `config/default.env`});

// load overrides
if (process.env.NODE_ENV !== `production`) {
  dotenv.config({path: `./.env`});
} else {
  dotenv.config();
}

const CONFIG = {
  PORT: process.env.PORT,
  LEARN_MORE_LINK: process.env.LEARN_MORE_LINK,
  PROJECT_BATCH_SIZE: process.env.PROJECT_BATCH_SIZE,
  PULSE_API: process.env.PULSE_API,
};

process.stdout.write(
  `${JSON.stringify(CONFIG)}\n`
);
