import Tabulator from "tabulator-tables"; 
import "tabulator-tables/dist/css/bootstrap/tabulator_bootstrap4.min.css";
import { formatter } from "../utils/formatter";

export default async function tableWidgetRenderer(ds, config, el) {
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
