----

<p align="center" class="toc">
   <strong><a href="#setup">Setup</a></strong>
   |
   <strong><a href="#running-lintingtests">Running linting/tests</a></strong>
   |
   <strong><a href="#writing-tests">Writing tests</a></strong>
   |
   <strong><a href="#bootstraping-a-new-package">Bootstraping a new package</a></strong>
   |
   <strong><a href="#making-a-release">Making a release</a></strong>
</p>

----

# Contributing

Contributions are always welcome, no matter how large or small.

## Not sure where to start?

**FIXME**

## Developing

Nodejs-monorepo-scaffold is built for Node 8 and up. We develop using Node 8 and yarn. You can check this with `node -v`.

Make sure that Yarn is installed with version >= `0.28.0`.
Installation instructions can be found here: https://yarnpkg.com/en/docs/install.

### Setup

```sh
$ git clone https://github.com/tracking-exposed/tracking-exposed
$ cd tracking-exposed
$ yarn install
$ yarn bootstrap
$ yarn build
```

The data processors are using the new stream feature of [Redis](https://redis.io/) that is still in beta. You need to run at least version 5 of Redis, which at this point is not released and therefore likely not available on your platform. This project provides a [Vagrant](https://www.vagrantup.com/) [file](Vagrantfile) to set up a local development server. See the [installation docs](https://www.vagrantup.com/downloads.html) on how to obtain Vagrant.

To start the development Redis server run in the project root the following command:

```sh
$ vagrant up
```

This will start a virtual machine and compile the latest release candidate of Redis 5. The server can be reached on the host machine on `localhost` and port `6379`. To use the Redis client connect to the Vagrant VM and start the client:

```sh
$ vagrant ssh
# redis-cli
```

### Running linting/tests

`tracking-exposed` uses (ESLint)(https://eslint.org/) for linting, [Flow](https://flow.org/) for type checking and [AVA](https://github.com/avajs/ava) for unit testing.

```sh
$ yarn lint
$ yarn test
$ yarn flow
```

Running `yarn lint` also checks the types.

### Writing tests

Tests are stored associated to the respective package they belong to.

### Bootstraping a new package

Use the example package in `bootstrap/module` to add a new node library and `bootstrap/widget` to add a new web component. Packages are published under the namespace `@tracking-exposed` and have a module name (e.g. `service-rss`).

```sh
$ cp -av bootstrap/module packages/<name>
$ find . -type f | grep -v "^\.\/\.git" | xargs sed -i -e "s/module/<name>/g"
```

The above `find` command works on Linux. On Mac `-i` needs to be followed by `''`:

```sh
$ find . -type f | grep -v "^\.\/\.git" | xargs sed -i '' -e "s/module/<name>/g"
```

For example, if the new package should be called `@tracking-exposed/service-abc`, run the following commands:

```sh
$ cp -av bootstrap/module packages/service-abc
$ find . -type f | grep -v "^\.\/\.git" | xargs sed -i -e "s/module/service-abc/g"
```

Or to bootstrap a new widget:

```sh
$ cp -av bootstrap/widget packages/widget-abc
$ find . -type f | grep -v "^\.\/\.git" | xargs sed -i -e "s/widget/widget-abc/g"
```

Make sure to edit and verify the following files before committing:

- `README.md` and add the new package to the `Packages` overview.
- `packages/<name>/package.json` and make sure the `name`, `repository` and `homepage` are correct and add a `description` and `keywords`.
- `packages/<name>/README.md`.
- `webpack.config.js` if package is a widget and edit the `library` field.

### Making a new release

Before making a new release ensure that the project builds as expected.

```sh
$ yarn build
```

Then release and push.

```sh
$ yarn release
$ git push --follow-tags origin master
```

This will trigger a build on [Travis](https://travis-ci.org/) and publish new packages to npm.
