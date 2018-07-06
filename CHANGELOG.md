# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.2.0"></a>
# 0.2.0 (2018-07-06)


### Bug Fixes

* **bootstrap:** paths to badges in readme ([068b03f](https://github.com/tracking-exposed/tracking-exposed/commit/068b03f))
* close the full circle of the rss generation ([3706417](https://github.com/tracking-exposed/tracking-exposed/commit/3706417))
* renamed processor-rss to process-rss ([c502082](https://github.com/tracking-exposed/tracking-exposed/commit/c502082))
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
* **process-entities:** extract entities from dandelion ([1c17b9f](https://github.com/tracking-exposed/tracking-exposed/commit/1c17b9f))
* **process-entities:** extract entities on stream events ([30995c5](https://github.com/tracking-exposed/tracking-exposed/commit/30995c5))
* **process-entities:** store extracted entities on an impression ([c87a9ce](https://github.com/tracking-exposed/tracking-exposed/commit/c87a9ce))
* **process-rss:** generate atom feed for entities ([0b7731e](https://github.com/tracking-exposed/tracking-exposed/commit/0b7731e))
* **process-rss:** treat multiple entities for one feed as a boolean AND ([49a6141](https://github.com/tracking-exposed/tracking-exposed/commit/49a6141))
* **processor-cli:** configure redis using environment variables ([80fcdc5](https://github.com/tracking-exposed/tracking-exposed/commit/80fcdc5))
* **processor-cli:** export redis interface ([db6faef](https://github.com/tracking-exposed/tracking-exposed/commit/db6faef))
* **processor-cli:** handle multiple events when polling from stream ([6a4e421](https://github.com/tracking-exposed/tracking-exposed/commit/6a4e421))
* **processor-cli:** manage stream processors using processorctl ([8e8e126](https://github.com/tracking-exposed/tracking-exposed/commit/8e8e126))
* **processor-cli:** poll and publish  on redis streams ([561990c](https://github.com/tracking-exposed/tracking-exposed/commit/561990c))
* **processor-cli:** register handlers on shutdown ([d3143c3](https://github.com/tracking-exposed/tracking-exposed/commit/d3143c3))
* **processor-cli:** store impressions in mongodb ([47cdca0](https://github.com/tracking-exposed/tracking-exposed/commit/47cdca0))
* **processor-rss:** bootstrapping module ([eeb972a](https://github.com/tracking-exposed/tracking-exposed/commit/eeb972a))
* **service-cli:** bootstrap the service manager ([d07c253](https://github.com/tracking-exposed/tracking-exposed/commit/d07c253))
* **service-cli:** start micro services using servicectl ([b302995](https://github.com/tracking-exposed/tracking-exposed/commit/b302995))
* **service-rss:** bootstrap rss service ([adfd8c9](https://github.com/tracking-exposed/tracking-exposed/commit/adfd8c9))
* **service-rss:** fetch cached or generate new feed ([192f751](https://github.com/tracking-exposed/tracking-exposed/commit/192f751))
* **service-rss:** sanitize url to allow more combinations of the same ([ece5643](https://github.com/tracking-exposed/tracking-exposed/commit/ece5643))
* **services-cli:** supply the service configuraton to the handler ([31545ea](https://github.com/tracking-exposed/tracking-exposed/commit/31545ea))
* **utils:** added ageingMemoize to cache with an expiration ([ef3604b](https://github.com/tracking-exposed/tracking-exposed/commit/ef3604b))
* fetch impressions from mongodb ([210220c](https://github.com/tracking-exposed/tracking-exposed/commit/210220c))
* split up loop function into runForever and runForeverUntil ([cdaaef0](https://github.com/tracking-exposed/tracking-exposed/commit/cdaaef0))
* use a more coherent config system using the cli parser ([5aacbc5](https://github.com/tracking-exposed/tracking-exposed/commit/5aacbc5))


### Reverts

* center headline in readme ([b893a5f](https://github.com/tracking-exposed/tracking-exposed/commit/b893a5f))
