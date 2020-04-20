# @codewell/retry

Recursively retries a function if it fails

## Installation

```
npm install @codewell/retry
```

## Basic Usage

```JavaScript
import retry from '@codewell/retry';

const options = { maxTries: 3 };

// If fetch("http://example.com") fails,
// retry will retry to call
// fetch("http://example.com") for 3 times
// before it gives up
retry(fetch, options)("http://example.com");
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
