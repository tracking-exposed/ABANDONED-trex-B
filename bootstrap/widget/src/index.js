// @flow
/** @jsx h */
import {h, Component} from "preact";
import "./index.css";

type Props = {
  recipient: string,
};

export default class App extends Component<Props> {
  static defaultProps = {
    recipient: "World",
  };

  render({recipient}: Props) {
    return (
      <div className="red">
        <h1>Hello, {recipient}!</h1>
        <i className="widget" />
      </div>
    );
  }
}
