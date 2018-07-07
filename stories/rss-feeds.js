/* eslint no-unused-vars: ["error", {"varsIgnorePattern": "^h$"}] */
/** @jsx h */
import {h} from "preact";
import {storiesOf} from "@storybook/react";
import WidgetRssFeeds from "../packages/widget-rss-feeds/src";

storiesOf("Storybook of the RSS feeds widget", module).add(
  "render the default widget",
  () => <WidgetRssFeeds />,
);
