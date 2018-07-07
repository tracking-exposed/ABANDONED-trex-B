/** @jsx h */
import test from "ava";
import {h} from "preact";
import {shallow} from "preact-render-spy";

import App from "../src";

test("widget renders with default props", (t) => {
  const context = shallow(<App />);
  t.is(context.find("h1").text(), "Hello, World!");
});

test("widget renders with custom props", (t) => {
  const context = shallow(<App recipient="Universe" />);
  t.is(context.find("h1").text(), "Hello, Universe!");
});
