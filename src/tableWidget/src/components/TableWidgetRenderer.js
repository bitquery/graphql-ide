import Tabulator from "tabulator-tables"; 
import "tabulator-tables/dist/css/tabulator.min.css"; 

export default async function tableWidgetRenderer(ds, config, el) {
	let values = undefined
	let cfg = {}
	if (!ds.values) {
		const data = await ds.fetcher()
		const json = await data.json()
		values = ds.setupData(json)
	} else {
		values = ds.values
		console.log(values)
	}
	cfg = {
		layout:"fitDataFill",
		layout:"fitDataTable",
		...config,
		data: values,
	}
	console.log(config)
    console.log(cfg)
	try {
		el && new Tabulator(`#${el}`, cfg)
	} catch (error) {
		console.log(error)
	}
}
