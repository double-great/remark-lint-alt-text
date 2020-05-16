# remark-lint-alt-text [![Build Status](https://travis-ci.com/double-great/remark-lint-alt-text.svg?branch=master)](https://travis-ci.com/double-great/remark-lint-alt-text)

A [remark-lint](https://github.com/remarkjs/remark-lint) plugin that finds unhelpful or missing image alt text.

It uses the rules definition from https://github.com/double-great/alt-text.

## Install

```sh
npm install --save-dev remark-cli @double-great/remark-lint-alt-text
```

Add the remark-lint-alt-text plugin to your remark configuration:

```json
"remarkConfig": {
  "plugins": [
    "@double-great/remark-lint-alt-text"
  ]
},
```
