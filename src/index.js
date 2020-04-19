const logError = (func, logLevel) => (error, args, tries) => {
  switch (logLevel) {
    case 1: {
      console.warn(`[Try ${tries}]: Failed to execute "${func.name}"`);
      break;
    }
    case 2: {
      console.warn(`[Try ${tries}]: Failed to execute "${func.name}"`);
      if (args.includes(null) || args.includes(undefined)) {
        console.warn(`Some of your arguments include undefined or null`);
      }
      console.error(error);
      break;
    }
    default: {
      /* Pass */
    }
  }
};

const defaultOptions = {
  maxTries: 3,
  delay: (tries) => 1000, // Wait one second as default,
  logLevel: 1, // 0 - 2,
};

const retry = (func, options = {}) => {
  const { maxTries, delay, logLevel } = {
    ...defaultOptions,
    ...options,
  };

  const logger = logError(func, logLevel);

  const functionCaller = (tries) => async (...args) => {
    if (tries < maxTries) {
      try {
        return await func(...args);
      } catch (error) {
        logger(error, args, tries);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            functionCaller(tries + 1)(...args)
              .then((result) => {
                resolve(result);
              })
              .catch((error) => {
                // This is the last depth
                reject(error);
              });
          }, delay(tries));
        });
      }
    } else {
      throw new Error(
        `Failed all ${maxTries} attempts to execute "${func.name}"`,
      );
    }
  };

  return functionCaller(0);
};

export default retry;
