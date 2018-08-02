# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.6.0"></a>
# [0.6.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.5.0...v0.6.0) (2018-08-02)


### Bug Fixes

* **data:** fetch all entities, not just subscribed ones ([ca87cdd](https://github.com/tracking-exposed/tracking-exposed/commit/ca87cdd))


### Features

* **data:** items in rss feeds are sorted by date ([5d2d65d](https://github.com/tracking-exposed/tracking-exposed/commit/5d2d65d))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.4.0...v0.5.0) (2018-07-31)




**Note:** Version bump only for package @tracking-exposed/data

<a name="0.4.0"></a>
# [0.4.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.3.0...v0.4.0) (2018-07-31)




**Note:** Version bump only for package @tracking-exposed/data

<a name="0.3.0"></a>
# [0.3.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.2.0...v0.3.0) (2018-07-31)


### Bug Fixes

* **data:** enforce sort order for feeds entities ([cfcc268](https://github.com/tracking-exposed/tracking-exposed/commit/cfcc268))
* **service-rss:** handle encoded urls gracefully ([f45a71d](https://github.com/tracking-exposed/tracking-exposed/commit/f45a71d))


### Features

* **data:** retrieve a list of all entities ([ed2b370](https://github.com/tracking-exposed/tracking-exposed/commit/ed2b370))




<a name="0.2.0"></a>
# 0.2.0 (2018-07-06)


### Bug Fixes

* close the full circle of the rss generation ([3706417](https://github.com/tracking-exposed/tracking-exposed/commit/3706417))
* **data:** export feeds ([1c4e3e6](https://github.com/tracking-exposed/tracking-exposed/commit/1c4e3e6))
* **data:** skip _id when querying mongo data ([a96bfa1](https://github.com/tracking-exposed/tracking-exposed/commit/a96bfa1))


### Features

* **data:** add entities to impressions and fetch impressions by entity ([a03aeac](https://github.com/tracking-exposed/tracking-exposed/commit/a03aeac))
* **data:** add to and fetch redis sets ([521a542](https://github.com/tracking-exposed/tracking-exposed/commit/521a542))
* **data:** cache redis and mongo client connections ([782bdc5](https://github.com/tracking-exposed/tracking-exposed/commit/782bdc5))
* **data:** fetch and add feed urls to entities ([7a65173](https://github.com/tracking-exposed/tracking-exposed/commit/7a65173))
* **data:** fetch the impression snippet along with the impression ([f43d5da](https://github.com/tracking-exposed/tracking-exposed/commit/f43d5da))
* **data:** generate feeds ([9261a2f](https://github.com/tracking-exposed/tracking-exposed/commit/9261a2f))
* **data:** new addToSet and findByMember operations for mongo ([bc02d25](https://github.com/tracking-exposed/tracking-exposed/commit/bc02d25))
* **process-rss:** treat multiple entities for one feed as a boolean AND ([49a6141](https://github.com/tracking-exposed/tracking-exposed/commit/49a6141))
* **service-rss:** sanitize url to allow more combinations of the same ([ece5643](https://github.com/tracking-exposed/tracking-exposed/commit/ece5643))
