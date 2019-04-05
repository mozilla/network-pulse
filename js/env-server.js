import dotenv from 'dotenv';

// Augument process.env with local .env or project defaults:

// load .env (process.env keys that are already set via the host environment (eg: Heroku) won't be changed)
dotenv.config();

// load default.env so that anything didn't get set in .env or the host environment will get a default value
dotenv.config({path: `config/default.env`});

let envUtilities= {
  serializeSafeEnvAsJSON: () => {
    //
    // WARNING! Only put variables safe for public consumption here! This is emitted on the client side!
    //
    // NEVER PUT PRIVATE KEYS HERE!!!
    //
    const config = {
      PORT: process.env.PORT,
      LEARN_MORE_LINK: process.env.LEARN_MORE_LINK,
      PROJECT_BATCH_SIZE: process.env.PROJECT_BATCH_SIZE,
      PROFILE_BATCH_SIZE: process.env.PROFILE_BATCH_SIZE,
      PULSE_API: `${process.env.PULSE_API}/v2`,
      PULSE_LOGIN_URL: process.env.PULSE_LOGIN_URL,
      PULSE_LOGOUT_URL: process.env.PULSE_LOGOUT_URL
    };

    return JSON.stringify(config);
  }
};

let env = process.env;

export { envUtilities, env };
