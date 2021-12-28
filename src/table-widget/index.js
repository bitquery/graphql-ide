import TableWidgetEditor from './src/components/TableWidgetEditor.js'
import TableWidgetRenderer from './src/components/tableWidgetRenderer.js'

class TablePlugin {
    constructor() {
        this.id = 'table.widget'
        this.name = 'Table Widget'
        this.editor = TableWidgetEditor
        this.renderer = TableWidgetRenderer
        this.source = 'node_modules/vega-widgets/src/components/widgets/tableWidgetRenderer.js'
    }
    supportsModel(model) {
        for (let key in model) {
			return (model[key].typeInfo.toString()[0]==='[' 
				&& model[key].typeInfo.toString().slice(-2, -1)!=='0')
		}
    }
}

export let tablePlugin = new TablePlugin()
