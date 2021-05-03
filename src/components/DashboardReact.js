import React from "react";
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { getDashboardQueries, setDashboard } from '../api/api'
import { getValueFrom } from '../utils/common'
import { TabsStore, QueriesStore } from '../store/queriesStore'
import { generateLink } from '../utils/common'
import { getQueryForDashboard } from '../api/api'
const ReactGridLayout = WidthProvider(RGL);

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
      newCounter: 1,
      currentId: ''
    };
  }
  async componentDidMount() {
    //load from gallery
    if (TabsStore.currentTab === TabsStore.tabs[this.props.number].id) {
      if (QueriesStore.currentQuery.id && QueriesStore.currentQuery.layout) {
        console.log('db load')
        const { data } = await getQueryForDashboard(QueriesStore.currentQuery.widget_ids)
        console.log(data)
        this.setState({
          items: JSON.parse(QueriesStore.currentQuery.layout),
        }, () => {
          for (let i=0; i<data.length; i++) {
            this.qrh(data[i], this.state.items[i].i)
          }
        })

      }
      if (QueriesStore.currentQuery.dbqueries) {
        console.log('dbquery')
        this.setState({
          items: JSON.parse(QueriesStore.currentQuery.layout),
        }, () => {
          for (let i=0; i<QueriesStore.currentQuery.dbqueries.length; i++) {
            this.qrh(QueriesStore.currentQuery.dbqueries[i], this.state.items[i].i)
          }
        })
      }
      //from "Add widget" button or onDrop 
      else if (QueriesStore.currentQuery.layout &&  !this.state.items.length ) {
        console.log('mounted')
        let currentId = "n" + generateLink()
        this.setState({
          // Add a new item. It must have a unique key!
          items: this.state.items.concat({
            i: currentId,
            x: (this.state.items.length * 2) % (this.state.cols || 12),
            y: Infinity, // puts it at the bottom
            w: 2,
            h: 2,
          }),
        }, () => this.qrh(QueriesStore.currentQuery, currentId))
      }
      window.addEventListener('query-request', this.qrh)
      return () => {
        window.removeEventListener('query-request', this.qrh)
      }
    }
  }

  qrh = (e, id) => {
    if (
    (TabsStore.currentTab === TabsStore.tabs[this.props.number].id)) {
    console.log('ololo')
    const query = e.detail ? e.detail : e
    console.log(query)
    const cfg = typeof query.config === 'string' ? JSON.parse(query.config) : query.config
    if (query.widget_id !== 'json.widget' &&query.widget_id) {
      let indexx = this.props.plugins.map(plugin => plugin.id).indexOf(query.widget_id)
      const WidgetComponent = indexx>=0 ? this.props.plugins[indexx] : this.props.plugins[0]
      const dataSource = {
        query: query.query,
        variables: JSON.parse(query.arguments),
        displayed_data: query.displayed_data,
        key: 'BQYszZIuPSqM0E5UdhNVRIj7qvHTuGSL',
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
      // console.log(WidgetComponent.id, this.state.items[this.state.items.length-1].id)
      let currentId = "n" + generateLink()
      this.setState({
        // widget_ids: [...this.state.widget_ids, query.widget_number],
        widget_ids: typeof QueriesStore.currentQuery.widget_ids === 'string' ? QueriesStore.currentQuery.widget_ids.split(',') : [...this.state.widget_ids, query.widget_number],
        items: !id ? this.state.items.concat({
          i: currentId,
          x: (this.state.items.length * 2) % (this.state.cols || 12),
          y: Infinity, // puts it at the bottom
          w: 2,
          h: 2
        }) : this.state.items,
        newCounter: this.state.newCounter + 1 
      }, () => {
                  QueriesStore.updateQuery({
                    widget_number: this.state.widget_ids,
                    layout: this.state.items,
                  }, TabsStore.index)
                  WidgetComponent.renderer(dataSource, cfg, id || currentId)
              }
      )
      
    }}
  }

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

  onRemoveItem(i) {
    console.log("removing", i);
    const index = this.state.items.map(item => item.i).indexOf(i)
    const widget_ids = [...this.state.widget_ids]
    widget_ids.splice(index, 1)
    this.setState({ 
      items: _.reject(this.state.items, { i: i }),
      widget_ids
    });

  }

  render() {
    return (
      <div className={'dashboard ' + (((TabsStore.currentTab === TabsStore.tabs[this.props.number].id) && QueriesStore.currentQuery.layout) ? 'active' : '')}
      > 
        <button onClick={()=>setDashboard({...this.state, id: QueriesStore.currentQuery.id})}>Save</button>
        <ReactGridLayout
          onLayoutChange={(layout)=>this.setState({ layout })}
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

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(AddRemoveLayout));
}

export default AddRemoveLayout
