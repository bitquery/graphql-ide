export const links = (model, variables, row) => {
	return {
		ethereum: {
			none: {
				supportsModel: () => true ,
				link: () => null
			},
			dex_protocol_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.protocol')) ,
				link: () => `dex_protocol/${row.protocol}`
			},
			dex_exchange_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.exchange.fullName')) ,
				link: () => row.exchange.fullName.startsWith('<') ? null : `dex/${row.exchange.fullName}`
			},
			token_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.currency.symbol') || item.includes('.currency.address')),
				link: () => row.currency.address==='-' ? `token/${row.currency.symbol}` : `token/${row.currency.address}`
			},
			buy_token_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.buyCurrency.address') || item.includes('.buyCurrency.address')),
				link: () => row.buyCurrency.address === '-' ? `token/${row.buyCurrency.symbol}` : `token/${row.buyCurrency.address}`
			},
			sell_token_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.sellCurrency.address') || item.includes('.sellCurrency.address')),
				link: () => row.sellCurrency.address === '-' ? `token/${row.sellCurrency.symbol}` : `token/${row.sellCurrency.address}`
			},
			smart_contract_method_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.smartContractMethod.signatureHash')),
				link: () => `method/${row.smartContractMethod.signatureHash}`
			},
			smart_contract_event_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.smartContractEvent.signatureHash')),
				link: () => `event/${row.smartContractEvent.signatureHash}`
			},
			address_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes(`${Object.keys(model)[2]}.address.address`)),
				link: () => row.address.address !== '0x0000000000000000000000000000000000000000' && `address/${row.address.address}`
			},
			sender_address_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.sender.address')),
				link: () => row.sender.address !== '0x0000000000000000000000000000000000000000' && `address/${row.sender.address}`
			},
			receiver_address_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.receiver.address')),
				link: () => row.receiver.address !== '0x0000000000000000000000000000000000000000' && `address/${row.receiver.address}`
			},
			block_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.block.height')),
				link: () => `block/${row.height || row.block.height}`
			},
			transaction_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.hash') || item.includes('.transaction.hash')),
				link: () => `tx/${row.hash || row.transaction.hash}`
			},
			smart_contract_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.smartContract.address.address')),
				link: () => row.smartContract.address.address!=='0x0000000000000000000000000000000000000000' && `smart_contract/${row.smartContract.address.address}`
			},
			property_value_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes(`${Object.keys(model)[2]}.address.address`) || item.includes('.block.height')),
				link: () => row.address && row.address.address !== '0x0000000000000000000000000000000000000000' 
				? `address/${row.address.address}`
				: row.block
					? `block/${row.block.height}`
					: null
			},
			token_pair_path: {
				supportsModel: () => Object.keys(model).some(item => item.includes('.baseCurrency.address') || item.includes('.quoteCurrency.address')),
				link: () => `tokenpair/${row.baseCurrency.address}/${row.quoteCurrency.address}`
			},
			transfer_to_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.currency.address') || item.includes('.currency.symbol') ),
				link: () => row.count_in === 0 ? null : `tx/transfers?receiver=${variables.address}&currency=${row.currency.address==='-' ? row.currency.symbol : row.currency.address}`+
					(row.address ? `&sender=${row.address.address}` : '')
			},
			transfer_from_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.currency.address') || item.includes('.currency.symbol') ),
				link: () => row.count_in === 0 ? null : `tx/transfers?sender=${variables.address}&currency=${row.currency.address==='-' ? row.currency.symbol : row.currency.address}`+
					(row.address ? `&receiver=${row.address.address}` : '')
			},
			transfer_token_sender_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.sender.address')),
				link: () => `tx/transfers?currency=${variables.address}&sender=${row.sender.address}`
			},
			transfer_token_receiver_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.receiver.address')),
				link: () => `tx/transfers?currency=${variables.address}&receiver=${row.sender.address}`
			},
			call_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.smartContract.address.address')),
				link: () => `tx/calls?caller=${variables.address}&contract=${row.smartContract.address.address}`
			},
			call_method_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.smartContractMethod.signatureHash')),
				link: () => `tx/calls?contract=${variables.address}&method=${row.smartContractMethod.signatureHash}`
			},
			event_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.smartContractEvent.signatureHash')),
				link: () => `tx/events?contract=${variables.address}&event=${row.smartContractEvent.signatureHash}`
			},
			internal_call_method_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.smartContractMethod.signatureHash')),
				link: () => `tx/calls?internal=true&contract=${variables.address}&method=${row.smartContractMethod.signatureHash}`
			},
			external_call_method_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes('.smartContractMethod.signatureHash')),
				link: () => `tx/calls?internal=false&contract=${variables.address}&method=${row.smartContractMethod.signatureHash}`
			},
			call_by_caller_count_path: {
				supportsModel: () => (variables && 'address' in variables) && Object.keys(model).some(item => item.includes(`${Object.keys(model)[2]}.address.address`)),
				link: () => `tx/calls?contract=${variables.address}&caller=${row.address.address}`
			}
		}
	}
}
