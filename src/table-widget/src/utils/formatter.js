export const formatter = (cell, formatterParams,  onRendered) => {
	let linkWithParams = ''
	let cells = {}
	let output = cell.getValue()
	let row = cell.getRow().getData()

	const links = {
		'none' : () => null,
		'dex_protocol_path': () => `dex_protocol/${row.protocol}`,
		'dex_exchange_path': () => row.exchange.fullName.startsWith('<') ? null : `dex/${row.exchange.fullName}`,
		'token_path': () => row.currency.address==='-' ? `token/${row.currency.symbol}` : `token/${row.currency.address}`,
		'buy_token_path': () => row.buyCurrency.address === '-' ? `token/${row.buyCurrency.symbol}` : `token/${row.buyCurrency.address}`,
		'sell_token_path': () => row.sellCurrency.address === '-' ? `token/${row.sellCurrency.symbol}` : `token/${row.sellCurrency.address}`,
		'transfer_to_path': () => row.count_in === 0 ? null : `txs/transfers?receiver=${formatterParams.variables.address}&currency=${row.currency.address==='-' ? row.currency.symbol : row.currency.address}`+
			(row.address ? `&sender=${row.address.address}` : ''),
		'transfer_from_path': () => row.count_in === 0 ? null : `txs/transfers?sender=${formatterParams.variables.address}&currency=${row.currency.address==='-' ? row.currency.symbol : row.currency.address}`+
			(row.address ? `&receiver=${row.address.address}` : ''),
		'transfer_token_sender_path': () => `txs/transfers?currency=${formatterParams.variables.address}&sender=${row.sender.address}`,
		'transfer_token_receiver_path': () => `txs/transfers?currency=${formatterParams.variables.address}&receiver=${row.sender.address}`,
		'smart_contract_method_path': () => `method/${row.smartContractMethod.signatureHash}`,
		'smart_contract_event_path': () => `event/${row.smartContractEvent.signatureHash}`,
		'address_path': () => row.address.address !== '0x0000000000000000000000000000000000000000' && `address/${row.address.address}`,
		'sender_address_path': () => row.sender.address !== '0x0000000000000000000000000000000000000000' && `address/${row.sender.address}`,
		'receiver_address_path': () => row.receiver.address !== '0x0000000000000000000000000000000000000000' && `address/${row.receiver.address}`,
		'block_path': () => `block/${row.height || row.block.height}`,
		'transaction_path': () => `txs/${row.hash || row.transaction.hash}`,
		'smart_contract_path': () => row.smartContract.address.address!=='0x0000000000000000000000000000000000000000' && `smart_contract/${row.smartContract.address.address}`,
		'call_count_path': () => `txs/calls?caller=${formatterParams.variables.address}&contract=${row.smartContract.address.address}`,
		'call_method_count_path': () => `txs/calls?contract=${formatterParams.variables.address}&method=${row.smartContractMethod.signatureHash}`,
		'event_count_path': () => `txs/events?contract=${formatterParams.variables.address}&event=${row.smartContractEvent.signatureHash}`,
		'internal_call_method_count_path': () => `txs/calls?internal=true&contract=${formatterParams.variables.address}&method=${row.smartContractMethod.signatureHash}`,
		'external_call_method_count_path': () => `txs/calls?internal=false&contract=${formatterParams.variables.address}&method=${row.smartContractMethod.signatureHash}`,
		'call_by_caller_count_path': () => `txs/calls?contract=${formatterParams.variables.address}&caller=${row.address.address}`,
		'property_value_path': () => row.address && row.address.address !== '0x0000000000000000000000000000000000000000' 
			? `address/${row.address.address}`
			: row.block
				? `block/${row.block.height}`
				: null,
		'token_pair_path': () => `tokenpair/${row.baseCurrency.address}/${row.quoteCurrency.address}`
	}
	
	cell.getRow().getCells().forEach(cell => {
		if (formatterParams.url) linkWithParams = `${linkWithParams}&${cell.getField()}=${cell.getValue()}`
		if (formatterParams.expression) cells[cell.getField()] = cell.getValue()
	})
	if (formatterParams.expression) {
		try {
			const fn = new Function('cells', `return ${formatterParams.expression}`)
			output = fn(cells)
		} catch (error) {
			console.log(error)
		}
	}
	if (formatterParams?.formatterType && links[formatterParams.formatterType]()) {
		const linkEl = document.createElement('a')
		const linkText = document.createTextNode(output)
		linkEl.href = `https://explorer.bitquery.io/${formatterParams.network}/${links[formatterParams.formatterType]()}`
		linkEl.target = '_blank'
		linkEl.appendChild(linkText)
		return linkEl
	}
	return output
}