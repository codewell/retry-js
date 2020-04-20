const devLib = require("../lib/dev");
const prodLib = require("../lib/prod");

const foo = (shouldSucceed) => {
  if (shouldSucceed) {
    return "Hello, World!";
  } else {
    throw new Error("Fail as expected");
  }
};

const asyncFoo = (shouldSucceed) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Hello, World!");
      } else {
        reject(new Error("Fail as expected"));
      }
    }, 1000);
  });
};

test("Test a success (dev)", (done) => {
  devLib(foo)(true).then((data) => {
    expect(data).toBe("Hello, World!");
    done();
  });
});

test("Test a success with async func (dev)", (done) => {
  devLib(asyncFoo)(true).then((data) => {
    expect(data).toBe("Hello, World!");
    done();
  });
});

test("Test a success (prod)", (done) => {
  prodLib(foo)(true).then((data) => {
    expect(data).toBe("Hello, World!");
    done();
  });
});

test("Test a success with async func (prod)", (done) => {
  prodLib(asyncFoo)(true).then((data) => {
    expect(data).toBe("Hello, World!");
    done();
  });
});

//
// Failures
//

test("Test a failure (dev)", (done) => {
  console.warn = jest.fn();
  const options = { maxTries: 5, backoffStrategy: (tries) => 100 };
  devLib(
    foo,
    options,
  )(false)
    .then(() => {
      /* Will not reach this */
    })
    .catch((error) => {
      expect(console.warn).toHaveBeenCalledTimes(options.maxTries);
      done();
    });
});

test("Test a failure (prod)", (done) => {
  console.warn = jest.fn();
  const options = { maxTries: 5, backoffStrategy: (tries) => 100 };
  prodLib(
    foo,
    options,
  )(false)
    .then(() => {
      /* Will not reach this */
    })
    .catch((error) => {
      expect(console.warn).toHaveBeenCalledTimes(options.maxTries);
      done();
    });
});
