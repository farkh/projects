import React from 'react'
import moment, { Moment } from 'moment'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

interface DatePickerProps {
    value: string
    onValueChange: (newValue: string) => void
    fullWidth?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = props => {
    const { value, onValueChange, fullWidth } = props

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
                autoOk
                disableToolbar
                fullWidth={fullWidth}
                variant="inline"
                format="DD MMM yyyy"
                margin="normal"
                placeholder="Deadline"
                id="date-picker-inline"
                value={value}
                onChange={(date: Moment, _: string) => onValueChange(date.format('DD MMM YYYY'))}
                style={{ margin: 0 }}
                KeyboardButtonProps = {{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    )
}

DatePicker.defaultProps = {
    fullWidth: false,
}
