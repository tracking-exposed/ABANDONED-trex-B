# `@tracking-exposed/process-entities`

Extract semantic entities from impressions using the [Dandelion](https://dandelion.eu/) API.

## Synopsis

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![npm version](https://img.shields.io/npm/v/@tracking-exposde/process-entities.svg?style=flat)](https://www.npmjs.com/package/@tracking-exposed/process-entities) [![Build Status](https://travis-ci.org/tracking-exposed/tracking-exposed.svg?branch=master)](https://travis-ci.org/tracking-exposed/tracking-exposed) [![Coverage Status](https://coveralls.io/repos/github/tracking-exposed/tracking-exposed/badge.svg)](https://coveralls.io/github/tracking-exposed/tracking-exposed)

- [Usage](#usage)
- [FAQ](#faq)

## Usage

```sh
npm install --save @tracking-exposed/process-entities
```

or using `yarn`:

```sh
yarn add @tracking-exposed/process-entities
```

Use the [`processorctl`](https://npmjs.com/packages/@tracking-exposed/processor-cli) command to start the entity extraction.

```sh
$ processorctl start -s impressions -p @tracking-exposed/process-entities
```

## FAQ

### Want to contribute to tracking-exposed/process-entities?

Check out our [CONTRIBUTING.md](../../CONTRIBUTING.md) to get started.
