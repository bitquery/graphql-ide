import React, { useEffect, useState } from 'react'

export const useStateAdaptation = (value, setValue, tabs, currentTab, deps) => {
	useEffect(() => {
		if (currentTab in value) {
			for (let key in value) {
				if (tabs.map(tab => tab.id).indexOf(+key)===-1) {
					const {[key]: deletedKey, ...actual} = value
					setValue({...value, [currentTab]: actual})
					return
				}
			}
		} else {
			setValue({...value, [currentTab]: {}})
		}
	}, deps)
}