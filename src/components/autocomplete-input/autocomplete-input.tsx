import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

interface AutocompleteInputProps<T> {
    value: string
    onInputChange: (value: string) => void
    label: string
    onSelect: (value: T) => void
    labelRenderer: (value: T) => string
    options?: T[]
}

export class AutocompleteInput<T> extends React.Component<AutocompleteInputProps<T>> {
    render() {
        const { value, onInputChange, label, onSelect, labelRenderer, options } = this.props

        return (
            <Autocomplete
                fullWidth
                options={options}
                getOptionLabel={labelRenderer}
                onChange={(_: React.ChangeEvent<{}>, newValue: T | string, unnecessary: any) => onSelect(newValue as T)}
                renderInput={(props: any) => (
                    <TextField
                        {...props}
                        label={label}
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
                    />
                )}
            />
        )
    }
}
