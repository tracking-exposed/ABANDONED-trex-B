/* eslint no-unused-vars: ["error", {"varsIgnorePattern": "^h$"}] */
/** @jsx h */
import {h} from "preact";
import "preact/devtools";
import {storiesOf} from "@storybook/react";
import WidgetRssFeeds from "../packages/widget-rss-feeds/src";

storiesOf("Storybook of the RSS feeds widget", module)
  .add("no entities available", () => <WidgetRssFeeds />)
  .add("with entities to choose from", () => {
    const allEntities = [
      "aa",
      "bb",
      "cc",
      "dd",
      "aaa",
      "bbb",
      "ccc",
      "Medicine",
      "Craft",
      "Art",
    ];
    return <WidgetRssFeeds {...{allEntities}} />;
  });
