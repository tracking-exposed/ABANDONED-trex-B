/** @jsx h */
import test from "ava";
import {h} from "preact";
import {shallow} from "preact-render-spy";

import WidgetRssFeeds from "../src";

test.skip("widget-rss-feeds renders with default props", (t) => {
  const context = shallow(<WidgetRssFeeds />);
  t.is(context.find("h1").text(), "Hello, World!");
});

test.skip("widget-rss-feeds renders with custom props", (t) => {
  const context = shallow(<WidgetRssFeeds recipient="Universe" />);
  t.is(context.find("h1").text(), "Hello, Universe!");
});
