import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

interface ConfirmationDialogProps {
    message: string
    onYes: () => void
    onNo: () => void
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onYes, onNo }) => (
    <Dialog
        open
        onClose={onNo}
    >
        <DialogContent>
            {message}
        </DialogContent>
        <DialogActions>
            <Button
                id="noButton"
                onClick={onNo}
            >
                No
            </Button>

            <Button
                id="yesButton"
                color="primary"
                variant="contained"
                onClick={onYes}
            >
                Yes
            </Button>
        </DialogActions>
    </Dialog>
)
