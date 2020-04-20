# @codewell/retry

Recursively retries to call a function if the execution fails.

## Installation

```
npm install @codewell/retry
```

## Basic Usage

```JavaScript
import retry from '@codewell/retry';

retry(fetch)("http://example.com")
  .then(data => {
    // Do something with the returned data,
    // in this case an http response,
    // from fetch("http://example.com")
  })
  .catch(error => {
    // This is where we end up if all retries
    // failed to execute
  });
```

`retry` will make the function call `fetch("http://example.com")`. If it fails, `retry` will try to call `fetch("http://example.com")` for 3 times (default) before it gives up.

### Configuration

`retry` is also configurable with options:

```JavaScript
import retry from '@codewell/retry';

const options = {
  // Number of tries before we stop
  maxTries: 3, // <- Default value

  // A function that returns number
  // of milliseconds to wait before
  // next execution
  backoffStrategy: (retryCount) => 1000, // <- Default function returns (1s)

  // Parameter from 0-2 that sets
  // how much logging retry should do.
  logLevel: 1, // <- Default value

};

retry(fetch, options)("http://example.com");
```

The `options` object is optional to pass. All options are optional to configure.

## Contribution

Please help by submitting issues and pull requests here on github
Read more on [codewell's webpage](https://codewell.github.io/contribution)
