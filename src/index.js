const logError = (func, logLevel) => (error, args, retryCount) => {
  switch (logLevel) {
    case 1: {
      console.warn(`[Retry ${retryCount}]: Failed to execute "${func.name}"`);
      break;
    }
    case 2: {
      console.warn(`[Retry ${retryCount}]: Failed to execute "${func.name}"`);
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
  backoffStrategy: (retryCount) => 1000, // Wait one second as default,
  logLevel: 1, // 0 - 2,
};

const retry = (func, options = {}) => {
  const { maxTries, backoffStrategy, logLevel } = {
    ...defaultOptions,
    ...options,
  };

  const logger = logError(func, logLevel);

  const functionCaller = (retryCount) => async (...args) => {
    if (retryCount < maxTries) {
      try {
        return await func(...args);
      } catch (error) {
        logger(error, args, retryCount);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            functionCaller(retryCount + 1)(...args)
              .then((result) => {
                resolve(result);
              })
              .catch((error) => {
                // This is the last depth
                reject(error);
              });
          }, backoffStrategy(retryCount));
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
