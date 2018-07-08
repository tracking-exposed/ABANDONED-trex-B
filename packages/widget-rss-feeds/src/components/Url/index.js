// @flow
/** @jsx h */
import {h, Component} from "preact";
import "./index.css";

type Props = {
  entities: string[],
  baseUrl: string,
};

export default class Url extends Component<Props> {
  static defaultProps = {
    entities: [],
  };

  baseName() {
    const baseName = this.props.entities
      .map((entity) => entity.trim().toLowerCase())
      .sort((a, b) => a.localeCompare(b))
      .join("+");
    return `${baseName}.xml`;
  }

  url() {
    const {baseUrl} = this.props;
    return `${baseUrl}/${this.baseName()}`;
  }

  clipboard = (event: Event) => {
    event.preventDefault();
    const element = document.createElement("input");
    const body = document.getElementsByTagName("body")[0];
    body.append(element);
    element.value = this.url();
    element.select();
    document.execCommand("copy");
    element.remove();
  };

  render({entities}: Props) {
    if (entities.length === 0) return <span />;
    return (
      <div className="flex">
        <input className="w-75" value={this.url()} disabled />
        <button
          className="feeds-rss-copy-icon w3 h2"
          onClick={this.clipboard}
        />
      </div>
    );
  }
}
