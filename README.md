# Tracking Exposed

<p align="center">
  <a href="https://tracking.exposed">
    <img alt="Tracking Exposed" src="https://cdn.rawgit.com/tracking-exposed/tracking-exposed/master/logo.svg">
  </a>
</p>

## Synopsis

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Build Status](https://travis-ci.org/tracking-exposed/tracking-exposed.svg?branch=master)](https://travis-ci.org/tracking-exposed/tracking-exposed) [![Coverage Status](https://coveralls.io/repos/github/tracking-exposed/tracking-exposed/badge.svg)](https://coveralls.io/github/tracking-exposed/tracking-exposed)

Tracking Exposed enables academic research and analysis on the impact of algorithms.

- Users that want data about their own filter bubble.
- Researchers collecting data with control groups in Facebook.
- Journalists interested in echo chambers and algorithm personalization.

## Packages

- [Core Packages](#core-packages)
- [Web Services](#web-services)
- [Stream Processors](#stream-processors)

### Core Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@tracking-exposed/service-cli`](/packages/service-cli) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/service-cli.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/service-cli) | Control a web service. |
| [`@tracking-exposed/processor-cli`](/packages/processor-cli) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/processor-cli.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/processor-cli) | Control a data processor. |
| [`@tracking-exposed/utils`](/packages/utils) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/utils.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/utils) | Utility functions for Tracking Exposed. |

### Web Services

| Package | Version | Description |
|---------|---------|-------------|
| [`@tracking-exposed/service-rss`](/packages/service-rss) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/service-rss.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/service-rss) | Subscribe to custom RSS feeds based on entities. |

### Stream Processors

| Package | Version | Description |
|---------|---------|-------------|
| [`@tracking-exposed/process-entities`](/packages/process-entities) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/process-entities.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/process-entities) | Process impressions and extract entities. |
| [`@tracking-exposed/process-rss`](/packages/process-rss) | [![npm](https://img.shields.io/npm/v/@tracking-exposed/process-rss.svg?maxAge=2592000)](https://www.npmjs.com/package/@tracking-exposed/process-rss) | Generate and cache RSS feeds. |

## FAQ

### Want to report a bug or request a feature?

Please read through our [CONTRIBUTING.md](CONTRIBUTING.md) and file an issue at [tracking-exposed/issues](https://github.com/tracking-exposed/tracking-exposed/issues)!

### Want to contribute to tracking-exposed?

Check out our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the repo.

### How is the repo structured?

This repo is managed as a [monorepo](https://github.com/lerna/lerna) that is composed of many [npm packages](packages).
