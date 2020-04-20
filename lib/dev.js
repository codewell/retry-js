"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }

  return target;
}

var logError = (func, logLevel) => (error, args, retryCount) => {
  switch (logLevel) {
    case 1: {
      console.warn(
        "[Retry "
          .concat(retryCount, ']: Failed to execute "')
          .concat(func.name, '"'),
      );
      break;
    }

    case 2: {
      console.warn(
        "[Retry "
          .concat(retryCount, ']: Failed to execute "')
          .concat(func.name, '"'),
      );

      if (args.includes(null) || args.includes(undefined)) {
        console.warn("Some of your arguments include undefined or null");
      }

      console.error(error);
      break;
    }
  }
};

var defaultOptions = {
  maxTries: 3,
  backoffStrategy: (retryCount) => 1000,
  // Wait one second as default,
  logLevel: 1, // 0 - 2,
};

var retry = function retry(func) {
  var options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var { maxTries, backoffStrategy, logLevel } = _objectSpread2(
    {},
    defaultOptions,
    {},
    options,
  );

  var logger = logError(func, logLevel);

  var functionCaller = (retryCount) =>
    /*#__PURE__*/ _asyncToGenerator(function* () {
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      if (retryCount < maxTries) {
        try {
          return yield func(...args);
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
          "Failed all "
            .concat(maxTries, ' attempts to execute "')
            .concat(func.name, '"'),
        );
      }
    });

  return functionCaller(0);
};

module.exports = retry;
