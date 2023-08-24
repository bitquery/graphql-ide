import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import StarIcon from './icons/StarIcon'

export const TokenAPIBadge = observer(function TokenAPIBadge({type, link, preffered}) {
	return (
		<Link to={`/${link}`}
			aria-label={type}
			aria-disabled={link ? 'false' : 'true'}
			className={`tokenapi_link ${preffered ? 'preffered' : ''} ${link ? '' : 'disabled'}`}
			tabIndex={link ? '0' : '-1'}
		>
			{preffered && <span className='tokenapi_star'>
				<StarIcon />
			</span>}
			{type}
		</Link>
	)
})
