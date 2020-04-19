# @codewell/retry

Recursively retries a function if it fails

## Installation

```
npm install @codewell/retry
```

## Basic Usage

```JavaScript
import retry from '@codewell/retry';

const foo = (name) => {
  console.log("Hello", name);
}

const options = { maxTries: 3 };

// If foo fails, retry will retry to
// call foo for 3 times.
retry(foo, options)("Optimus Prime");
```

### Options

| key        |  description                      | default           |
| :--------- | :-------------------------------- | :---------------- |
| `maxTries` | number of tries before we give up | 3                 |
| `delay`    | How long to wait before we retry  | `(tries) => 1000` |
| `logLevel` | 0 - 2, how much we will log       | 1                 |

## Contribution

Please help by submitting issues and pull requests here on github
Read more on [codewell's webpage](https://codewell.github.io/contribution)
