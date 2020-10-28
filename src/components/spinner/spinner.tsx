import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import './spinner.scss'

export const Spinner: React.FC = () => (
    <div className="spinner-overlay">
        <CircularProgress />
    </div>
)
