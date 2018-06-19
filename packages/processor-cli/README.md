# `@tracking-exposed/processor-cli`

Control event processors for [Tracking Exposed](https://tracking.exposed).

## Synopsis

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![npm version](https://img.shields.io/npm/v/@tracking-exposde/processor-cli.svg?style=flat)](https://www.npmjs.com/package/@tracking-exposed/processor-cli) [![Build Status](https://travis-ci.org/tracking-exposed/tracking-exposed.svg?branch=master)](https://travis-ci.org/tracking-exposed/tracking-exposed) [![Coverage Status](https://coveralls.io/repos/github/tracking-exposed/tracking-exposed/badge.svg)](https://coveralls.io/github/tracking-exposed/tracking-exposed)

```sh
processorctl -h
```

- [Usage](#usage)
  - [Start a processor](#start-a-processor)
- [FAQ](#faq)

## Usage

```sh
npm install --save @tracking-exposed/processor-cli
```

or using `yarn`:

```sh
yarn add @tracking-exposed/processor-cli
```

The `processorctl` command is used to manage any event processing.

### Start a processor

To start a processor, supply the name of the stream to read events from, and the name of a processor to call.

```sh
$ processortctl start --stream impressions --processor @tracking-exposde/process-entities
```

- `--stream, -s`: The name of the Redis stream to listen on.
- `--processor, -p`: The name of the processor module or a path to a processor to load.

## FAQ

### Want to contribute to tracking-exposed/processor-cli?

Check out our [CONTRIBUTING.md](../../CONTRIBUTING.md) to get started.
