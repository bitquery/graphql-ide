import React from 'react';

import debounce from '../../utils/debounce';

export default class SearchBox extends React.Component {
  debouncedOnSearch;

  constructor(props) {
    super(props);
    this.state = { value: props.value || '' };
    this.debouncedOnSearch = debounce(200, this.props.onSearch);
  }

  render() {
    return (
      <label className="search-box">
        <div className="search-box-icon" aria-hidden="true">
          {'\u26b2'}
        </div>
        <input
          value={this.state.value}
          onChange={this.handleChange}
          type="text"
          placeholder={this.props.placeholder}
          aria-label={this.props.placeholder}
        />
        {this.state.value && (
          <button
            className="search-box-clear"
            onClick={this.handleClear}
            aria-label="Clear search input">
            {'\u2715'}
          </button>
        )}
      </label>
    );
  }

  handleChange = event => {
    const value = event.currentTarget.value;
    this.setState({ value });
    this.debouncedOnSearch(value);
  };

  handleClear = () => {
    this.setState({ value: '' });
    this.props.onSearch('');
  };
}
