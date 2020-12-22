import BarWidgetEditor from '../widgets/BarWidgetEditor'
import BarWidgetRenderer from '../widgets/BarWidgetRenderer'
import PieWidgetEditor from '../widgets/PieWidgetEditor'
import PieWidgetRenderer from '../widgets/PieWidgetRenderer'

class BarPlugin {
	constructor() {
		this.id = 'vega.bar'
		this.name = 'Bar Widget'
		this.editor = BarWidgetEditor
		this.renderer = BarWidgetRenderer
	}
	supportsModel(model) {
		if (
			(model.includes('String!') || model.includes('Int!')) &&
			(model.includes('Int') || model.includes('Float'))
		) { return true } else { return false }
	}
}
class PiePlugin {
	constructor() {
		this.id = 'vega.pie'
		this.name = 'Pie Widget'
		this.editor = PieWidgetEditor
		this.renderer = PieWidgetRenderer
	}
	supportsModel(model) {
		if (
			(model.includes('String') || model.includes('Int') || model.includes('Float')) &&
			(model.includes('String') || model.includes('Int') || model.includes('Float'))
		) { return true } else { return false }
	}
}

export let vegaPlugins = [new BarPlugin(), new PiePlugin()]
