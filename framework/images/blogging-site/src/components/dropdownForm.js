import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

export default function DropdownForm({dropdownInputs}) {
    let value = dropdownInputs.value
    let label = dropdownInputs.label
    let options = dropdownInputs.options

    return (
        <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
            sx={{width:"100%"}}
            value={value}
            label={label}
            onChange={dropdownInputs.onChange}
        >
            {options.map((item, index)=> {
                return <MenuItem key={index} value={item}>{item}</MenuItem>
            })}
        </Select>
        </FormControl>
    )
}