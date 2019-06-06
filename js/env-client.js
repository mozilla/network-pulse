let env = {};

if (typeof document !== `undefined`) {
  // Scrape env from dom
  env = JSON.parse(
    document.getElementById(`environment-variables`).textContent
  );
} else {
  // If this code is run on the server...just use process.env
  // There appears to be some isomorphic rendering that blows up without this case
  env = process.env;
}

export default env;
