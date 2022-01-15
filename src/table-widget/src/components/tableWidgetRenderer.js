import Tabulator from "tabulator-tables"; 
import "../index.css"
import { formatter } from "../utils/formatter.js";

export default async function tableWidgetRenderer(ds, config, el) {
	if (config?.columns?.length) {
		let values = undefined
		let cfg = {}
		if (!ds.values) {
			const data = await ds.fetcher()
			const json = await data.json()
			values = ds.setupData(json)
		} else {
			values = ds.values
		}
		let newCol = [...config.columns]
		newCol.forEach(col => {
			if (col?.formatterParams?.formatterType)
				col.formatterParams.links = ds.links
				col.formatterParams = {...col.formatterParams, network: ds.displayed_data.split('.')[0], variables: ds.variables}
		})
		newCol.forEach(col => col.formatter = col.formatterParams && formatter)
		cfg = {
			height: '100%',
			layout: 'fitColumns',
			...config,
			data: values,
		}
		try {
			console.log('config is ', cfg)
			el && new Tabulator(`#${el}`, cfg)
		} catch (error) {
			console.log(error)
		}
	}
}
