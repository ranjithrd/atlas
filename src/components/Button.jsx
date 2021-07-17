import React from 'react'

function Button({ title, onClick, outlined, className }) {

	const o = outlined ?? false

	return (
			<button
				type="submit"
				className={'p-3 mt-4 w-full rounded-lg font-bold text-lg shadow-lg ' + (o ? 'bg-white text-yellow-800 border-2 border-yellow-800 border-opacity-100' : 'bg-yellow-800 text-white ') + (className ?? '')}
				onClick={onClick}
			>
				{title}
			</button>
	)
}

export default Button
