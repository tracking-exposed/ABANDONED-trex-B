// @flow
/** @jsx h */
import {h, Component} from "preact";
import Url from "./components/Url";
import "./index.css";

type Props = {
  baseUrl: string,
  allEntities: string[],
};

type State = {
  entities: string[],
  suggestions: string[],
  query: string,
};

export default class WidgetRssFeeds extends Component<Props, State> {
  static defaultProps = {
    allEntities: [],
    baseUrl: "https://tracking.exposed/feeds",
  };

  state = {
    entities: [],
    suggestions: [],
    query: "",
  };

  inputElement: ?HTMLInputElement;

  handleSelect = (key: string, event: Event) => {
    event.preventDefault();
    this.selectSuggestion(key);
  };

  handleUnselect = (key: string, event: Event) => {
    event.preventDefault();
    this.unselectEntity(key);
  };

  handleHover = (key: string) => {
    this.setState({query: key});
  };

  handleKeyPress = (event: KeyboardEvent) => {
    const {query, suggestions} = this.state;
    switch (event.keyCode) {
      case 13: {
        if (query !== "") this.selectSuggestion(query);
        break;
      }
      case 40:
      case 38: {
        let index =
          suggestions.indexOf(query) + (event.keyCode === 40 ? +1 : -1);
        if (index < 0) index = suggestions.length - 1;
        if (index >= suggestions.length) index = 0;
        this.setState({query: suggestions[index]});
        break;
      }
      case 27: {
        this.deselectInput();
        this.setState({query: "", suggestions: []});
        break;
      }
      default:
    }
  };

  handleFocus = () => {
    const {query, suggestions} = this.state;
    if (query === "" && suggestions.length === 0)
      this.setState({
        suggestions: this.allSuggestions(),
      });
  };

  handleBlur = () => {
    this.setState({query: "", suggestions: []});
  };

  handleQueryChange = () => {
    if (!this.inputElement) return;
    const query = this.inputElement.value;
    const suggestions =
      query === "" ? this.allSuggestions() : this.suggestionsForQuery(query);
    this.setState({
      query,
      suggestions,
    });
  };

  selectSuggestion(id: string) {
    const {entities} = this.state;
    this.deselectInput();
    this.setState({
      query: "",
      entities: Array.from(new Set(entities.concat([id]))).sort((a, b) =>
        a.localeCompare(b),
      ),
      suggestions: [],
    });
  }

  unselectEntity(id: string) {
    const {entities} = this.state;
    this.deselectInput();
    this.setState({
      entities: Array.from(
        new Set(entities.filter((entity) => entity !== id)),
      ).sort((a, b) => a.localeCompare(b)),
      suggestions: [],
    });
  }

  deselectInput() {
    if (this.inputElement) this.inputElement.blur();
  }

  suggestionsForQuery(term: string): string[] {
    const {entities} = this.state;
    const pattern = new RegExp(`^${term}`);
    return this.filterSuggestions(
      (entity) =>
        pattern.test(entity.toLowerCase().trim()) &&
        !entities.includes(entity.toLowerCase().trim()),
    );
  }

  allSuggestions() {
    const {entities} = this.state;
    return this.filterSuggestions(
      (entity) => !entities.includes(entity.toLowerCase().trim()),
    );
  }

  filterSuggestions(fn: (string) => boolean) {
    return this.props.allEntities
      .filter(fn)
      .map((entity) => entity.trim().toLowerCase())
      .sort((a, b) => a.localeCompare(b));
  }

  renderSuggestions() {
    const {suggestions, query} = this.state;
    return (
      <ul className="list pa0 shadow-1 overflow-y-scroll overflow-x-hidden z-999 mh-0">
        {suggestions.map((suggestion) => (
          <li
            id={suggestion}
            key={suggestion}
            className={`pointer pl2 ${
              query === suggestion ? "bg-light-gray" : ""
            }`}
            data-role="suggestion"
            onMouseDown={(event) => this.handleSelect(suggestion, event)}
            onMouseOver={() => this.handleHover(suggestion)}
          >
            <span className="">{suggestion}</span>
          </li>
        ))}
      </ul>
    );
  }

  renderEntities() {
    const {entities} = this.state;
    return (
      <ul className="flex flex-wrap ma0 pa0">
        {entities.map((entity) => (
          <li
            className="dib ma1 pa1 h2 bg-light-gray br4 mw-100 truncate flex justify-between"
            id={entity}
            key={entity}
            data-role="selected-entity"
          >
            <span>{entity}</span>
            <span
              onClick={(event) => this.handleUnselect(entity, event)}
              className="w2 h2 rss-feeds-entity-icon r0 pointer"
            />
          </li>
        ))}
      </ul>
    );
  }

  render({baseUrl, allEntities}: Props, {query, suggestions, entities}: State) {
    return (
      <div className="flex flex-column relative">
        {allEntities.length > 0 ? <Url {...{baseUrl, entities}} /> : ""}
        {entities.length > 0 ? this.renderEntities() : <div />}
        <label className="blue" data-role="label">
          {allEntities.length > 0
            ? "Choose entities:"
            : "No Entities to choose from."}
        </label>
        <input
          data-role="input"
          name="feeds-q"
          className="input-reset br4-l bb b--white-20 pb0"
          disabled={allEntities.length > 0}
          // eslint-disable-next-line no-return-assign
          ref={(element) => (this.inputElement = element)}
          label=""
          autoComplete="off"
          spellCheck="false"
          aria-label="Search for Entities."
          onKeyUp={this.handleKeyPress}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onInput={this.handleQueryChange}
          value={query}
        />
        {suggestions.length > 0 ? this.renderSuggestions() : ""}
      </div>
    );
  }
}
