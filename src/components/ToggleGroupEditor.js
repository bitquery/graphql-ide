import React, { useState } from 'react'
import { ToggleButtonGroup, ToggleButton, ButtonGroup } from 'react-bootstrap'

function ToggleGroupEditor({ switchView }) {
    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'Query Editor', value: '1' },
        { name: 'Dashboard', value: '2' },
    ]
    const handleChange = e => {
        setRadioValue(e.currentTarget.value)
        switchView()
    }

  return (
    <ButtonGroup toggle>
        {radios.map((radio, idx) => (
            <ToggleButton
                key={idx}
                type="radio"
                variant={radioValue===radio.value ? 'primary' : 'link'}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={handleChange}
            >
                {radio.name}
            </ToggleButton>
        ))}
    </ButtonGroup>
  )
}

export default ToggleGroupEditor
