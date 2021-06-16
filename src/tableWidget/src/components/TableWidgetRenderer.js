import $ from 'jquery'
import bootstrapTable from 'bootstrap-table'
export default async function tableWidgetRenderer(ds, config, el) {
	let values = undefined
	if (!ds.values) {
		const data = await ds.fetcher()
		const json = await data.json()
		values = ds.setupData(json)
	} else {
		values = ds.values
	}
	let cfg = {
		pagination: true,
        search: true,
        sorting: true,
		...config,
		data: values
	}
    console.log(cfg)
	try {
		el &&
            $(function() {
                $(`#${el}`).empty().bootstrapTable({
                    pagination: true,
                    search: true,
                    sorting: true,
                    ...cfg
                })
            })
	} catch (error) {
		console.log(error)
	}
}
