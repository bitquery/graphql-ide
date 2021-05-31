import React from "react";
import { observer } from 'mobx-react'
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { getValueFrom } from '../utils/common'
import { TabsStore, QueriesStore } from '../store/queriesStore'
import { generateLink } from '../utils/common'
import { getQueryForDashboard } from '../api/api'
import Loader from "react-loader-spinner"
import { withRouter, Link } from 'react-router-dom'
import LinkComponent from './Gallery/LinkComponent'
import { Dropdown } from 'react-bootstrap'
import { ContentBlock } from './ContentBlock'
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
				isDraggable: false,
				isResizable: false,
				isRemovable: false,
				dashboard_id: null,
				widget_ids: [],
				dashboard_item_indexes: [],
				content: [],
				layout: [],
				items: [],
				queries: [],
				newCounter: 1,
				currentId: '',
				saved: true
			};
			this.onDrop = this.onDrop.bind(this)
			this.makeCustomizable = this.makeCustomizable.bind(this)
			this.makeStatic = this.makeStatic.bind(this)
			this.onEditBlockContent = this.onEditBlockContent.bind(this)
			this.qrh = this.qrh.bind(this)
		}
		async componentDidMount() {
			console.log('dash mount')
			const queryString = window.location.search
			const urlParams = new URLSearchParams(queryString)
			const entries = urlParams.entries()
			let args = {}
			if (entries) {
				for (const entry of entries) {
					args[entry[0]] = entry[1]
				}
				console.log(args)
			}
			
			//------------------------------------
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number].id) {
				//load by link && load from gallery
				if (QueriesStore.currentQuery.id && QueriesStore.currentQuery.layout) {
					console.log('db load')
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
						const cfg = JSON.parse(data[i].config)
						if (cfg.content) content[position] = cfg.content
					}
					this.setState({
						items: layout,
						dashboard_item_indexes,
						widget_ids,
						queries,
						content
					}, () => {
						//replace variables from url params
						//if (Object.keys(args).length) updatedData = {...data[i], arguments: args}
						for (let i = 0; i < data.length; i++) {
							this.qrh(data[i], data[i].query_index)
						}
						this.setState({ saved: false })
					})
				}
				//from "Add widget" button
				else if (QueriesStore.currentQuery.layout && !this.state.items.length) {
					console.log('mounted')
					this.setState({ saved: false })
					this.qrh(QueriesStore.currentQuery)
				} else {
					this.setState({ saved: false })
				}
				window.addEventListener('query-request', this.qrh)
				return () => {
					window.removeEventListener('query-request', this.qrh)
				}
			}
		}

		qrh = (e, id) => {
			if (TabsStore.currentTab === TabsStore.tabs[this.props.number]?.id) {
				
				const query = e.detail ? e.detail : e
				console.log('ololo')
				const repeatProtector = this.state.saved ? true : !this.state.widget_ids.includes(query.widget_number)
				console.log(query)
				const cfg = typeof query.config === 'string' ? JSON.parse(query.config) : query.config
				if (query.widget_id !== 'json.widget' && query.widget_id && repeatProtector) {
					let indexx = this.props.plugins.map(plugin => plugin.id).indexOf(query.widget_id)
					const WidgetComponent = indexx >= 0 ? this.props.plugins[indexx] : this.props.plugins[0]
					const dataSource = {
						query: query.query,
						variables: query.arguments ? JSON.parse(query.arguments) : '',
						displayed_data: query.displayed_data,
						key: 'BQYszZIuPSqM0E5UdhNVRIj7qvHTuGSL',
						setupData: (json) => ('data' in json) ? getValueFrom(json.data, query.displayed_data) : null,
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
			console.log(content, index)
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
			const i = el.add ? "+" : el.i;
			const element = this.state.queries[index].widget_id === 'block.content' 
			? (<ContentBlock value={this.state.content[index]} onEdit={content=>this.onEditBlockContent(content, index)}/>) 
			: (<>
				<div
					className="item-container"
					id={el.i}
				>
					<Loader
						type="Oval"
						color="#3d77b6"
						height={25}
						width={25}
					/>
				</div>
			</>
			)
			return (
				<div key={i} data-grid={el} className={this.state.menuActive===index ? 'item_high' : ''}>
					<div className="flex justify-content-between">
					<div>{this.state.queries[index].name}</div>
					<Dropdown className={'dashboard__item__menu cursor-pointer item_high'} onToggle={ isOpen => isOpen && this.setState({menuActive: index}) }>
						<Dropdown.Toggle id="dropdown-basic" as={'span'} >
							<i className="fas fa-ellipsis-h"></i>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{this.state.queries[index].query && <Dropdown.Item>
								<LinkComponent propquery={this.state.queries[index]} as={'menu'}></LinkComponent>
							</Dropdown.Item>}
							<Dropdown.Item href="# " onClick={this.onRemoveItem.bind(this, i)}>Remove</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					</div>
					{element}
					{this.state.isDraggable && <span style={moveStyle} />}
				</div>
			)
		}

		onRemoveItem(i) {
			console.log("removing", i);
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
			console.log(layout)
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

		makeCustomizable() {
			this.setState({
				isDraggable: true,
				isResizable: true,
				isRemovable: false
			})
		}
		makeStatic() {
			this.setState({
				isDraggable: false,
				isResizable: false,
				isRemovable: false
			})
		}

		render() {
			return (
				<div className={'dashboard ' + (((TabsStore.currentTab === TabsStore.tabs[this.props.number].id) && QueriesStore.currentQuery.layout) ? 'active' : '')}
				>
					{this.state.items.length ? <>
						<p>
							Now dashboard is {
								this.state.isDraggable && this.state.isResizable ? 'customizable'
									: this.state.isRemovable ? 'removable' : 'static'
							}
						</p>
						<button onClick={this.makeCustomizable}>make customizable (move and drag)</button>
						<button onClick={this.makeStatic}>make static</button></> : null}
					<ReactGridLayout
						onLayoutChange={(layout) => this.onLayoutChange({ layout })}
						onClick={() => console.log('hello')}
						{...this.props}
						isDraggable={this.state.isDraggable}
						isResizable={this.state.isResizable}
						onDrop={this.onDrop}
						isDroppable={true}
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
