import React, { useState } from 'react'

export const ModalContext = React.createContext()

export const ModalProvider = ({ children }) => {
	const [registerIsOpen, setRegisterIsOpen] = useState(false)
	const [saveQueryIsOpen, setSaveQueryIsOpen] = useState(false)
	const toggleRegister = () => setRegisterIsOpen(prev => !prev)
	const toggleSaveQuery = () => setSaveQueryIsOpen(prev => !prev)

	return (
		<ModalContext.Provider 
			value={{
				registerIsOpen,
				toggleRegister,
				saveQueryIsOpen,
				toggleSaveQuery
			}} 
		>
			{children}
		</ModalContext.Provider>
	)
}

