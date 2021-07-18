import React from "react"

function Alert({ className, title, message, button, onButton }) {
	return (
		<div
			className={
				className + "bg-white rounded-xl shadow-xl flex flex-col"
			}
		>
			<div className="p-6">
				<h3 className="text-2xl font-bold">{title}</h3>
				{message ? <div className="mt-2">{message}</div> : ""}
			</div>
			<button
				className="w-full py-3 border-t-2 border-gray-600 font-bold"
				onClick={onButton}
			>
				{button}
			</button>
		</div>
	)
}

export default Alert
