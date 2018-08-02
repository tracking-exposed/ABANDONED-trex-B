# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.6.0"></a>
# [0.6.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.5.0...v0.6.0) (2018-08-02)


### Bug Fixes

* **data:** fetch all entities, not just subscribed ones ([ca87cdd](https://github.com/tracking-exposed/tracking-exposed/commit/ca87cdd))
* **process-rss:** handle rss generation for entities ([06e79a8](https://github.com/tracking-exposed/tracking-exposed/commit/06e79a8))


### Features

* **data:** items in rss feeds are sorted by date ([5d2d65d](https://github.com/tracking-exposed/tracking-exposed/commit/5d2d65d))


### Performance Improvements

* **rss-widget:** improve performance of typeahead input ([9b2d716](https://github.com/tracking-exposed/tracking-exposed/commit/9b2d716))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.4.0...v0.5.0) (2018-07-31)




**Note:** Version bump only for package tracking-exposed

<a name="0.4.0"></a>
# [0.4.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.3.0...v0.4.0) (2018-07-31)




**Note:** Version bump only for package tracking-exposed

<a name="0.3.0"></a>
# [0.3.0](https://github.com/tracking-exposed/tracking-exposed/compare/v0.2.0...v0.3.0) (2018-07-31)


### Bug Fixes

* **data:** enforce sort order for feeds entities ([cfcc268](https://github.com/tracking-exposed/tracking-exposed/commit/cfcc268))
* **script:** set visibility field on impression ([ed4d544](https://github.com/tracking-exposed/tracking-exposed/commit/ed4d544))
* **scripts:** treat promises right when fetching impressions ([e4e5dee](https://github.com/tracking-exposed/tracking-exposed/commit/e4e5dee))
* **service-rss:** construct feed url without exception ([9147c43](https://github.com/tracking-exposed/tracking-exposed/commit/9147c43))
* **service-rss:** handle encoded urls gracefully ([f45a71d](https://github.com/tracking-exposed/tracking-exposed/commit/f45a71d))
* **service-rss:** handle incoming feed urls better ([912bf08](https://github.com/tracking-exposed/tracking-exposed/commit/912bf08))
* **widget-rss-feeds:** ignore case when typing entities ([6bcc144](https://github.com/tracking-exposed/tracking-exposed/commit/6bcc144))
* **widget-rss-feeds:** only disable widget if there are no entities ([5f5dd60](https://github.com/tracking-exposed/tracking-exposed/commit/5f5dd60))
* **widget-rss-feeds:** treat allEntities lower case ([81034cd](https://github.com/tracking-exposed/tracking-exposed/commit/81034cd))
* **widget-rss-feeds:** verify that a suggestion is a valid selection ([379115a](https://github.com/tracking-exposed/tracking-exposed/commit/379115a))


### Features

* **data:** retrieve a list of all entities ([ed2b370](https://github.com/tracking-exposed/tracking-exposed/commit/ed2b370))
* **process-rss:** generate a json file of all entities ([31bd500](https://github.com/tracking-exposed/tracking-exposed/commit/31bd500))
* **processor-cli:** cache event id across invocations ([9bbd2ef](https://github.com/tracking-exposed/tracking-exposed/commit/9bbd2ef))
* **scripts:** import script from rest API ([eda6cdd](https://github.com/tracking-exposed/tracking-exposed/commit/eda6cdd))
* **utils:** added simple cli logger ([e2e8d51](https://github.com/tracking-exposed/tracking-exposed/commit/e2e8d51))
* **widget:** support for UI widgets ([6cbb229](https://github.com/tracking-exposed/tracking-exposed/commit/6cbb229))
* **widget-rss-feed:** bootstrap the widget ([ba81c36](https://github.com/tracking-exposed/tracking-exposed/commit/ba81c36))
* **widget-rss-feeds:** added rss feed generator widget ([eccd55a](https://github.com/tracking-exposed/tracking-exposed/commit/eccd55a))
* **widget-rss-feeds:** fetch all entities in the example index ([e1daa9b](https://github.com/tracking-exposed/tracking-exposed/commit/e1daa9b))




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
