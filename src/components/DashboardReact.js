import React from "react";
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { getDashboardQueries, setDashboard } from '../api/api'
import { getValueFrom } from '../utils/common'
import { TabsStore, QueriesStore } from '../store/queriesStore'
const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const AddRemoveLayout = observer(
class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
      dashboard_id: null,
      widget_ids: [],
	    layout: [],
      items: [],
      queries: [],
      newCounter: 0
    };

	  this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
  }
  componentDidMount() {
    /* getDashboardQueries('dashboard').then(res => {
      this.setState({
        dashboard_id: res.data.dashboard_id,
        layout: res.data.layout,
        items: res.data.layout.length ? 
        res.data.layout.map(layout => layout) :
        []
      })
      res.data.queries.forEach((query, i) => {
        const data = {...query, i: `n${i}`}
        this.setState(prevState => ({
          queries: [...prevState.queries, query]
        }))
        this.qrh(data)
      })
    }) */
    console.log('mounted')
    if (QueriesStore.currentQuery.layout) {
      this.setState({
        // Add a new item. It must have a unique key!
        items: this.state.items.concat({
          i: "n" + this.state.newCounter,
          x: (this.state.items.length * 2) % (this.state.cols || 12),
          y: Infinity, // puts it at the bottom
          w: 2,
          h: 2
        }),
        // Increment the counter to ensure key is always unique.
        newCounter: this.state.newCounter + 1
      }, () => this.qrh(QueriesStore.currentQuery));
    }
    window.addEventListener('query-request', this.qrh)
    return () => {
      window.removeEventListener('query-request', this.qrh)
    }
  }

  qrh = e => {
    console.log('ololo')
    const query = e.detail ? e.detail : e
    const cfg = typeof query.config === 'string' ? JSON.parse(query.config) : query.config
    if (this.state.items.length > 0) {
      let indexx = this.props.plugins.map(plugin => plugin.id).indexOf(query.widget_id)
      const WidgetComponent = indexx>=0 ? this.props.plugins[indexx] : this.props.plugins[0]
      const dataSource = {
        query: query.query,
        variables: JSON.parse(query.arguments),
        displayed_data: query.displayed_data,
        key: process.env.REACT_APP_IDE_GUEST_API_KEY,
        setupData: (json) => ('data' in json) ? getValueFrom(json.data, query.displayed_data) : null,
        fetcher: function() {
          let keyHeader = {'X-API-KEY': this.key}
          return fetch(
            'https://graphql.bitquery.io',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...keyHeader
              },
              body: JSON.stringify({query: query.query, variables: query.arguments}),
              credentials: 'same-origin',
            },
          )
        }
      }
      console.log(WidgetComponent.id, this.state.items[this.state.items.length-1].id)
      this.setState(prevState => ({
        widget_ids: [...prevState.widget_ids, query.widget_number]
      }))
      WidgetComponent.renderer(dataSource, cfg, `n${this.state.items.length-1}`)
      this.setState(prevState => ({
        queries: [...prevState.queries, query]
      }))
    }
  }

  /* componentDidUpdate(prevProps, prevState) {
	 if (prevState.items.length !== this.state.items.length &&
		prevState.items.length < this.state.items.length) {
      window.addEventListener('query-request', this.qrh)
      return () => {
        window.removeEventListener('query-request', this.qrh)
      }
	}
  } */

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        <div 
          style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} 
          id={el.i} 
        />
            <span
              className="remove"
              style={removeStyle}
              onClick={this.onRemoveItem.bind(this, i)}
            >
              x
            </span>
      </div>
    );
  }

  onAddItem() {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1
    });
  }

  // We're using the cols coming back from this to calculate where to add new items.

  onLayoutChange(layout) {
	  saveToLS("layout", layout);
    this.setState({ layout });
    //this.props.onLayoutChange(layout); // updates status display
  }

  onRemoveItem(i) {
    console.log("removing", i);
    const index = i[1]
    let newItems = [...this.state.items]
    newItems.splice(index, 1)
    for (let k = index; k < newItems.length; k++) {
      console.log(newItems)
      newItems[k].i = `n${newItems[k].i.split('')[1]--}`
    }
    console.log(newItems)
    this.setState({
      items: newItems,
      newCounter: this.state.newCounter - 1
    });
    // this.setState({ items: _.reject(this.state.items, { i: i }) });

  }

  onDrop = (layout, layoutItem, _event) => {
	console.log("adding", "n" + this.state.newCounter);
    this.setState({
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      }),
      newCounter: this.state.newCounter + 1
    });
    alert(`Dropped element props:\n${JSON.stringify(layoutItem, ['x', 'y', 'w', 'h'], 2)}`);
  };

  render() {
    return (
      <div className={'graphiql__wrapper ' + 
          (TabsStore.currentTab === TabsStore.tabs[this.props.number].id ? 'graphiql__wrapper_active' : '')
        }
      > 
        <button onClick={()=>setDashboard(this.state)}>Save</button>
        <ReactGridLayout
          onLayoutChange={this.onLayoutChange}
          {...this.props}
          onDrop={this.onDrop}
          isDroppable={true}
          onResize={()=>window.dispatchEvent(new Event('resize'))}
          onResizeStop={()=>window.dispatchEvent(new Event('resize'))}
        >
          {_.map(this.state.items, el => this.createElement(el))}
        </ReactGridLayout>
      </div>
    );
  }
})

function getFromLS(key) {
	let ls = {};
	if (global.localStorage) {
	  try {
		ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
	  } catch (e) {
		/*Ignore*/
	  }
	}
	return ls[key];
  }
  
  function saveToLS(key, value) {
	if (global.localStorage) {
	  global.localStorage.setItem(
		"rgl-7",
		JSON.stringify({
		  [key]: value
		})
	  );
	}
  }

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(AddRemoveLayout));
}

export default AddRemoveLayout
