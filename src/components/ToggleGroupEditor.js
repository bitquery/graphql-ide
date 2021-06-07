import React from 'react'
import { Form } from 'react-bootstrap'

function ToggleGroupEditor({ switchView, isQuery, number }) {
    const handleChange = e => {
        switchView()
    }
  return (
    <Form>
        <div key={`inline-radio-${number}`}>
            <Form.Check inline label="Query Editor" name="group1" type={'radio'} id={`inline-radio-1`} checked={isQuery} onChange={handleChange} />
            <Form.Check inline label="Dashboard" name="group1" type={'radio'} id={`inline-radio-2`} checked={!isQuery} onChange={handleChange} />
        </div>
    </Form>
  )
}

export default ToggleGroupEditor
