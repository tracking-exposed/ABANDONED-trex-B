/* eslint import/no-extraneous-dependencies: off, no-unused-vars: off */
// @flow
import {createElement, cloneElement, Component, type Node} from "react";

declare module "preact" {
  declare function h(): createElement;
  // declare export {h, Component};
  // declare export default {h, Component};
  declare function render(
    vnode: Node,
    parent: Element,
    toReplace?: Element,
  ): Element;

  declare export {h, createElement, cloneElement, Component, render};
  // declare export default {h, createElement, cloneElement, Component, render};
}
