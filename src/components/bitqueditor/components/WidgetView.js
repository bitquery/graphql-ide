import React, { useEffect, useRef } from 'react'
import { QueriesStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react'

import JsonWidget from "./JsonComponent";

const WidgetView = observer(function WidgetView({ children, widget, dataSource, ready }) {
	const { currentQuery } = QueriesStore
	const refJson = useRef(null)
	const refChart = useRef(null)

	useEffect(() => {
		const initWidget = async () => {
			try {
				console.log("initWidget запускается");
				console.log("dataSource:", dataSource);

				if ((dataSource && dataSource.historyDataSource) || (dataSource && dataSource.subscriptionDataSource)) {
					console.log("dataSource найдено");

					if (refJson.current.childNodes.length) {
						console.log("refJson очищается");
						refJson.current.removeChild(refJson.current.firstChild);
					}
					if (refChart.current.childNodes.length) {
						console.log("refChart очищается");
						refChart.current.removeChild(refChart.current.firstChild);
					}

					const jsonWidgetInstance = new JsonWidget(refJson.current, dataSource.historyDataSource, dataSource.subscriptionDataSource);
					console.log("jsonWidgetInstance создан:", jsonWidgetInstance);
					await jsonWidgetInstance.init(!!!widget);

					if (widget && (dataSource.historyDataSource || dataSource.subscriptionDataSource)) {
						console.log("widget перед обработкой:", widget);

						const explicitHeight = widget.match(/height:.*\d(px| +|)(,|)( +|)$/gm);
						if (explicitHeight) {
							console.log("explicitHeight найден:", explicitHeight);
							widget = widget.replace(explicitHeight[0], '');
							console.log("widget после удаления explicitHeight:", widget);
						}

						console.log("widget перед eval:", widget);

						let ChartWidget;
						try {
							ChartWidget = eval(`(${widget})`);
							console.log("ChartWidget после eval:", ChartWidget);
						} catch (evalError) {
							console.error("Ошибка при выполнении eval:", evalError);
							throw evalError; // Пробрасываем ошибку дальше
						}

						if (typeof ChartWidget !== 'function') {
							console.error("ChartWidget не является функцией/классом:", ChartWidget);
							return;
						}

						let chartWidgetInstance;
						try {
							console.log("Создаём экземпляр ChartWidget...");
							chartWidgetInstance = new ChartWidget(
								refChart.current,
								dataSource.historyDataSource,
								dataSource.subscriptionDataSource
							);
							console.log("chartWidgetInstance создан:", chartWidgetInstance);
						} catch (instanceError) {
							console.error("Ошибка при создании экземпляра ChartWidget:", instanceError);
							throw instanceError;
						}

						try {
							console.log("Инициализация chartWidgetInstance...");
							await chartWidgetInstance.init();
							console.log("chartWidgetInstance успешно инициализирован");
						} catch (initError) {
							console.error("Ошибка при инициализации chartWidgetInstance:", initError);
							throw initError;
						}

						if (dataSource.historyDataSource) {
							console.log("Вызов changeVariables для historyDataSource");
							dataSource.historyDataSource.changeVariables();
						}
						if (dataSource.subscriptionDataSource) {
							console.log("Вызов changeVariables для subscriptionDataSource");
							dataSource.subscriptionDataSource.changeVariables();
						}
					}
				}
			} catch (error) {
				console.error("Ошибка в initWidget:", error);
				console.error("Стек вызовов:", error.stack);
			}
		};

		initWidget();
		// eslint-disable-next-line
	}, [dataSource]);

	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [currentQuery.widget_id])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			{(dataSource?.historyDataSource && currentQuery.widget_id !== 'config.widget' && ready) && 
				<div className='response-time'>
					<i className="bi bi-clock-fill mr-1"/>
					{currentQuery.responseTime > 999 ? currentQuery.responseTime/1000 : currentQuery.responseTime}
					{currentQuery.responseTime > 999 ? 's' : 'ms'}
			</div>}
			<div ref={refJson} className={"result-window result-window-json " + (currentQuery.widget_id !== 'config.widget' ? 'result-window-active' : '')} />
			<div ref={refChart} className={"result-window result-window-chart " + (currentQuery.widget_id === 'config.widget' ? 'result-window-active' : '')} />
		</>
	)
})

export default WidgetView
