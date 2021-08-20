import React from "react";
import { observer } from 'mobx-react'
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { getValueFrom } from '../utils/common'
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore'
import { generateLink } from '../utils/common'
import { getQueryForDashboard } from '../api/api'
import Loader from "react-loader-spinner"
import LinkComponent from './Gallery/LinkComponent'
import { Dropdown } from 'react-bootstrap'
import { ContentBlock } from './ContentBlock'
import micromark from 'micromark'
import { flattenData } from "./flattenData";
const ReactGridLayout = WidthProvider(RGL);

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const AddRemoveLayout = observer(
	class AddRemoveLayout extends React.PureComponent {
		static defaultProps = {
			className: "layout",
			rowHeight: 100,
			resizeHandles: ['sw', 'nw', 'se', 'ne'],
			// verticalCompact: false
		};

		blockContentNumber = -1

		constructor(props) {
			super(props);

			this.state = {
				menuActive: null,
				dashboard_id: null,
				widget_ids: [],
				initialWidget_ids: [],
				dashboard_item_indexes: [],
				initial_dashboard_item_indexes: [],
				content: [],
				layout: [],
				initialItems: [],
				initialLayout: [],
				initialContent: [],
				items: [],
				queries: [],
				initialQueries: [],
				newCounter: 1,
				currentId: '',
				saved: true
			};
			this.onDrop = this.onDrop.bind(this)
			this.onEditBlockContent = this.onEditBlockContent.bind(this)
			this.qrh = this.qrh.bind(this)
		}
		async componentDidMount() {
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number].id) {
				//------------------------------------
				const queryString = window.location.search
				const urlParams = new URLSearchParams(queryString)
				const entries = urlParams.entries()
				let args = {}
				if (entries) {
					for (const entry of entries) {
						args[entry[0]] = entry[1]
					}
				}
				//load by link && load from gallery
				if (QueriesStore.currentQuery.id && QueriesStore.currentQuery.layout) {
					const { data } = await getQueryForDashboard(QueriesStore.currentQuery.widget_ids, QueriesStore.currentQuery.id)
					const layout = JSON.parse(QueriesStore.currentQuery.layout)
					const layoutindexes = layout.map(i => i.i)
					let dashboard_item_indexes = []
					let widget_ids = []
					let queries = []
					let content = []
					for (let i = 0; i < data.length; i++) {
						const position = layoutindexes.indexOf(data[i].query_index)
						dashboard_item_indexes[position] = data[i].query_index
						widget_ids[position] = data[i].widget_number
						queries[position] = data[i]
						let queryArguments = JSON.parse(queries[position].arguments)
						if (Object.keys(args).length) {
							for (const arg in args) {
								Object.keys(queryArguments).forEach(queryArg => {
									if (queryArg === arg) {
										queryArguments[queryArg] = isNaN(+args[arg]) ? args[arg] : +args[arg]
									}
								})
							}
							queries[position].arguments = JSON.stringify(queryArguments)
						}
						// if (Object.keys(args).length) queries[position].arguments = JSON.stringify(args)
						const cfg = JSON.parse(data[i].config)
						if (cfg.content) content[position] = cfg.content
					}
					this.setState({
						items: layout,
						dashboard_item_indexes,
						widget_ids,
						queries,
						content,
						initialLayout: layout,
						initialItems: layout,
						initial_dashboard_item_indexes: dashboard_item_indexes,
						initialWidget_ids: widget_ids,
						initialQueries: queries,
						initialContent: content,
					}, () => {
						for (let i = 0; i < data.length; i++) {
							this.qrh(data[i], data[i].query_index)
						}
						this.setState({ saved: false })
					})
				}
				else {
					this.setState({ saved: false })
				}
				window.addEventListener('query-request', this.qrh)
				window.addEventListener('setInitialDashboard', this.setInitialDashboard)
				window.addEventListener('updateInitialDashboard', this.updateInitialDashboard)
				return () => {
					window.removeEventListener('query-request', this.qrh)
					window.removeEventListener('setInitialDashboard', this.setInitialDashboard)
					window.removeEventListener('updateInitialDashboard', this.updateInitialDashboard)
				}
			}
		}

		setInitialDashboard = () => {
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number]?.id) {
				this.setState({
					items: this.state.initialItems,
					layout: {layout: this.state.initialLayout},
					dashboard_item_indexes: this.state.initial_dashboard_item_indexes,
					widget_ids: this.state.initialWidget_ids,
					queries: this.state.initialQueries,
					content: this.state.initialContent
				}, () => QueriesStore.updateQuery({saved: true}, TabsStore.index))
			}
		}
		updateInitialDashboard = () => {
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number]?.id) {
				this.setState({
					initialItems: this.state.layout.layout,
					initialLayout: this.state.layout.layout,
					initial_dashboard_item_indexes: this.state.dashboard_item_indexes,
					initialWidget_ids: this.state.widget_ids,
					initialQueries: this.state.queries,
					initialContent: this.state.content
				}, () => QueriesStore.updateQuery({saved: true}, TabsStore.index))
			}
		}
		qrh = (e, id) => {
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number]?.id && (QueriesStore.currentQuery.isDraggable || this.state.saved) || (QueriesStore.currentQuery.layout && !QueriesStore.currentQuery.id)) {
				
				const query = e.detail ? e.detail : e
				const repeatProtector = this.state.saved ? true : !this.state.widget_ids.includes(query.widget_number)
				let cfg = typeof query.config === 'string' ? JSON.parse(query.config) : query.config
				if (query.widget_id !== 'json.widget' && query.widget_id && repeatProtector) {
					let indexx = this.props.plugins.map(plugin => plugin.id).indexOf(query.widget_id)
					const WidgetComponent = indexx >= 0 ? this.props.plugins[indexx] : this.props.plugins[0]
					
					const dataSource = {
						query: query.query,
						variables: query.arguments ? JSON.parse(query.arguments) : '',
						displayed_data: query.displayed_data,
						key: UserStore.user ? UserStore.user.key : process.env.REACT_APP_IDE_GUEST_API_KEY,
						setupData: (json) => {
							let values = null
							if ('data' in json) {
								if (query.displayed_data) {
									if (query.data_type === 'flatten') {
										values = flattenData(json.data)
									} else {
										values = getValueFrom(json.data, query.displayed_data)
									}
								} else {
									values = json.data
								}
							}
							return values
						},
						fetcher: function () {
							let keyHeader = { 'X-API-KEY': this.key }
							return fetch(
								'https://graphql.bitquery.io',
								{
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										...keyHeader
									},
									body: JSON.stringify({ query: query.query, variables: query.arguments }),
									credentials: 'same-origin',
								},
							)
						}
					}
					let currentId = query.widget_id === 'block.content' ? "ctn" + generateLink() : "n" + generateLink()
					const updateAndRender = () => {
						QueriesStore.updateQuery({
							widget_ids: this.state.widget_ids,
							dashboard_item_indexes: this.state.dashboard_item_indexes,
							content: this.state.content,
							saved: this.state.saved
						}, TabsStore.index)
						query.widget_id !== 'block.content' &&	WidgetComponent.renderer(dataSource, cfg, id || currentId)
					}
					if (!id) {
						this.setState({
							widget_ids: [...this.state.widget_ids, query.widget_number || this.blockContentNumber],
							dashboard_item_indexes: [...this.state.dashboard_item_indexes, currentId],
							queries: query.id || query.widget_id === 'block.content' ? [...this.state.queries, query] : [...this.state.queries],
							items: this.state.items.concat({
								i: currentId,
								x: (this.state.items.length * 2) % (this.state.cols || 12),
								y: Infinity, // puts it at the bottom
								w: 2,
								h: 2
							})
						}, () => updateAndRender())
					} else { 
						updateAndRender()
					}
			}}
		}
		queryUrl = queryUrl => queryUrl ? `${process.env.REACT_APP_IDE_URL}/${queryUrl}` : `${process.env.REACT_APP_IDE_URL}`
		onEditBlockContent({content}, index) {
			const queries = [...this.state.queries]
			queries[index].content = content
			const workContent = [...this.state.content]
			workContent[index] = content
			this.setState({ queries, content: workContent }, () => QueriesStore.updateQuery({ content: workContent }, TabsStore.index))
		}
		createElement(el, index) {
			const moveStyle = {
				position: "absolute",
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor: 'move',
				width: '100%',
				height: '100%',
				opacity: .6,
			}
			if (this.state.queries[index].widget_id === 'block.content') {
				moveStyle.height = '24px'
			}
			const i = el.add ? "+" : el.i;
			const parsedMD = {__html: micromark(this.state.content[index] || '')}
			const elementMarkUp = QueriesStore.currentQuery.isDraggable ?
				(<ContentBlock 
					editMode={QueriesStore.currentQuery.isDraggable} 
					value={this.state.content[index]} 
					onEdit={content=>this.onEditBlockContent(content, index)}
				/>) : 
				(<section 
					className="md__render"
					dangerouslySetInnerHTML={parsedMD}
				/>)
			const element = this.state.queries[index].widget_id === 'block.content' 
				? elementMarkUp
				: (<>
					<div
						className="item-container table-striped"
						id={el.i}
					>
						<Loader
							type="Oval"
							color="#3d77b6"
							height={25}
							width={25}
						/>
					</div>
				</>)
			return (
				<div key={i} data-grid={el} className={this.state.menuActive===index ? 'item_high' : ''}>
					<div className="flex justify-content-between">
					<div>{this.state.queries[index].name}</div>
					{(this.state.queries[index].widget_id !=='block.content' || QueriesStore.currentQuery.isDraggable) &&
						<Dropdown className={'dashboard__item__menu cursor-pointer item_high'} onToggle={ isOpen => isOpen && this.setState({menuActive: index}) }>
							<Dropdown.Toggle id="dropdown-basic" as={'span'} >
								<i className="fas fa-ellipsis-h"></i>
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{this.state.queries[index].query && <Dropdown.Item>
									<LinkComponent propquery={this.state.queries[index]} as={'menu'}></LinkComponent>
								</Dropdown.Item>}
								{QueriesStore.currentQuery.isDraggable && <Dropdown.Item href="# " onClick={this.onRemoveItem.bind(this, i)}>Remove</Dropdown.Item>}
							</Dropdown.Menu>
						</Dropdown>}
					</div>
					{element}
					{QueriesStore.currentQuery.isDraggable && <span style={moveStyle} />}
				</div>
			)
		}

		onRemoveItem(i) {
			const index = this.state.items.map(item => item.i).indexOf(i)
			const widget_ids = [...this.state.widget_ids]
			let dashboard_item_indexes = [...this.state.dashboard_item_indexes]
			const queries = [...this.state.queries]
			dashboard_item_indexes = dashboard_item_indexes.filter(index => index !== i)
			queries.splice(index, 1)
			widget_ids.splice(index, 1)
			this.setState({
				items: _.reject(this.state.items, { i: i }),
				queries,
				widget_ids,
				dashboard_item_indexes
			}, () => QueriesStore.updateQuery({
				widget_ids: this.state.widget_ids,
				dashboard_item_indexes: this.state.dashboard_item_indexes,
				saved: this.state.saved
			}, TabsStore.index));

		}

		onLayoutChange(layout) {
			this.setState({ layout })
			QueriesStore.updateQuery({
				layout: layout.layout,
				saved: this.state.saved
			}, TabsStore.index)
		}

		onDrop(_, __, event) {
			let blockType = event.dataTransfer.getData('text/plain')
			blockType === 'block.content' && this.qrh({ widget_id: 'block.content' })
		}

		render() {
			return (
				<div className={'dashboard ' + (((TabsStore.currentTab === TabsStore.tabs[this.props.number].id) && QueriesStore.currentQuery.layout) ? 'active' : '')}
				>
					<ReactGridLayout
						onLayoutChange={(layout) => this.onLayoutChange({ layout })}
						{...this.props}
						layout={this.state.layout.layout}
						isDraggable={QueriesStore.currentQuery.isDraggable || (QueriesStore.currentQuery.layout && !QueriesStore.currentQuery.id) || false}
						isResizable={QueriesStore.currentQuery.isResizable || (QueriesStore.currentQuery.layout && !QueriesStore.currentQuery.id) || false}
						onDrop={this.onDrop}
						isDroppable={QueriesStore.currentQuery.isDraggable || (QueriesStore.currentQuery.layout && !QueriesStore.currentQuery.id) || false}
						onResize={() => window.dispatchEvent(new Event('resize'))}
						onResizeStop={() => window.dispatchEvent(new Event('resize'))}
					>
						{this.state.items.map((el, i) => this.createElement(el, i))}
					</ReactGridLayout>
				</div>
			);
		}
	})

if (process.env.STATIC_EXAMPLES === true) {
	import("../test-hook.jsx").then(fn => fn.default(AddRemoveLayout));
}

export default AddRemoveLayout
