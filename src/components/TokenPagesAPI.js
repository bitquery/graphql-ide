import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { getQueryTemplates } from '../api/api'
import { TokenAPIBadge } from './TokenAPIBadge'
import CopyIcon from './icons/CopyIcon'
import copy from 'copy-to-clipboard'

export const TokenPagesAPI = observer(function TokenPagesAPI() {
	const { symbol, address } = useParams()
	const [qts, setQts] = useState([[]])
	const { hash } = useLocation()
	const history = useHistory()

	useEffect(() => {
		const main = async () => {
			let data
			try {
				const response = await getQueryTemplates(address, symbol)
				data = response.data
			} catch (error) {
				if (error.response.status === 302) {
					window.location = `/exploreapi/USDT/0xdac17f958d2ee523a2206206994597c13d831ec7`
				}
			}
			if (data[0].tokenaddress !== address) {
				history.replace(`/exploreapi/${symbol}/${data[0].tokenaddress}`)
			}
			data && setQts(data)

			const tokenAddr = data[0].tokenaddress
			const metaTitle = `${symbol || tokenAddr} Token API`
			const metaDescription = `List of APIs to get ${symbol} data on Ethereum blockchain. We cover all APIs including ${symbol} Transfers, ${symbol} balance, ${symbol} token holders, ${symbol} price`
			const metaKeywords = `${symbol} Trace API, track ${symbol} erc20, ${symbol} token address, ${symbol} token price, binance ${symbol} token address, ethereum $token, ${symbol} api, ${symbol} payment api, ERC20 ${symbol} api, ${symbol} transfer, track $token, ${symbol} wallet, ${symbol} price ticker, ${symbol} price on different exchanges, ${symbol} stats`

			document.title = `${symbol || tokenAddr} Token API`
			document.querySelector('meta[name="title"]').setAttribute('content', metaTitle)
			document.querySelector('meta[name="description"]').setAttribute('content', metaDescription)
			document.querySelector('meta[name="keywords"]').setAttribute('content', metaKeywords)

			document.querySelector('meta[property="og:title"]').setAttribute('content', metaTitle)
			document.querySelector('meta[property="og:description"]').setAttribute('content', metaDescription)

			document.querySelector('meta[name="twitter:title"]').setAttribute('content', metaTitle)
			document.querySelector('meta[name="twitter:description"]').setAttribute('content', metaDescription)

			if (hash) {
				const el = document.querySelector(hash)
				el && el.scrollIntoView({ behavior: 'smooth' })
			}
		}

		if (symbol) main()
	}, [address, symbol, hash])


	return (
		<div className='token_apis_wrapper overflow-auto'>
			<div className='token_apis'>
				<div className='token_description mt-3 mb-3 p-4' id={`${symbol.toUpperCase()}-APIs`}>
					<div className="tokenapi_logo mr-4">
						<div className="tokenapi_logo_inner">
							<p>Token API</p>
						</div>
					</div>
					<div className="token_api_description">
						<div className='flex align-items-center'>
							<h5>{symbol.toUpperCase()} APIs</h5>
							<a href={`#${symbol.toUpperCase()}-APIs`}>
								<CopyIcon className="mb-2 ml-2 cursor-pointer" onClick={() => copy(`${window.location.origin}${window.location.pathname}#${symbol.toUpperCase()}-APIs`)} />
							</a>
						</div>
						{symbol.toUpperCase()} is an ERC20 token on the Ethereum blockchain. Here is the {symbol.toUpperCase()} address <a className='explorer-link' href={`https://explorer.bitquery.io/ethereum/${qts[0].subject_type}/${qts[0].tokenaddress}`}>{qts[0].tokenaddress}</a>.
						Try our {symbol.toUpperCase()} GraphQL APIs to get {symbol.toUpperCase()} transfers, trades, OHLC candlestick data, price, balance, token holders, events, calls, and transaction data on the Ethereum blockchain.
						You can get both historical and real-time {symbol.toUpperCase()} data with our APIs.
					</div>
				</div>
				<ul className='token_api pl-0'>
					{qts.map(qt => (
						<li key={qt?.url} className='api_subject flex mb-1 p-4' id={qt.url}>
							<div className='api_description_wrapper flex flex-column'>
								<h5>
									<span className='token_symbol'>{symbol.toUpperCase()}</span>{qt?.name}
									<a href={`#${qt.url}`}>
										<CopyIcon className="mb-1 ml-2 cursor-pointer" onClick={() => copy(`${window.location.origin}${window.location.pathname}#${qt.url}`)} />
									</a>
								</h5>
								<p className='api_description'>{qt?.description}</p>
							</div>
							<ul className='api_versions flex'>
								<TokenAPIBadge
									type="V1 APIs"
									link={qt.query_v1 ? `/${qt.query_v1}?token=${qt.tokenaddress}` : ''}
									preffered={qt.api_version === 'v1'}
								/>
								<TokenAPIBadge
									type="V2 APIs"
									link={qt.query_v2 ? `/${qt.query_v2}?token=${qt.tokenaddress}` : ''}
									preffered={qt.api_version === 'v2'}
								/>
								<TokenAPIBadge
									type="Websocket"
									link={qt.query_subscription ? `/${qt.query_subscription}?token=${qt.tokenaddress}` : ''}
									preffered={qt.api_version === 'websocket'}
								/>
							</ul>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
})
