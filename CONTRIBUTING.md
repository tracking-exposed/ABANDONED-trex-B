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

Use the example package in `bootstrap/module` to add a new package. Packages are published under the namespace `@tracking-exposed` and have a module name (e.g. `service-rss`).

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

Make sure to edit and verify the following files before committing:

- `README.md` and add the new package to the `Packages` overview.
- `packages/<name>/package.json` and make sure the `name`, `repository` and `homepage` are correct and add a `description` and `keywords`.
- `packages/<name>/README.md`.

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
