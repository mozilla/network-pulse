var dotenv = require(`dotenv`);

// load .env
dotenv.config();

// load default.env so that anything didn't get set in .env will fallback to its default value
dotenv.config({path: `config/default.env`});

const CONFIG = {
  PORT: process.env.PORT,
  LEARN_MORE_LINK: process.env.LEARN_MORE_LINK,
  PROJECT_BATCH_SIZE: process.env.PROJECT_BATCH_SIZE,
  PULSE_API: process.env.PULSE_API,
};

process.stdout.write(
  `${JSON.stringify(CONFIG)}\n`
);
