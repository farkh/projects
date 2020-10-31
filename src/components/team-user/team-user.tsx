import React from 'react'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import FaceIcon from '@material-ui/icons/Face'

import { AuthorizedUser } from '../../stores/user-store'

interface TeamUserProps {
    user: AuthorizedUser
    onDeleteClick?: () => void
}

export const TeamUser: React.FC<TeamUserProps> = ({ user, onDeleteClick }) => (
    <Chip
        icon={user.avatar ? null : <FaceIcon />}
        color="primary"
        avatar={<Avatar alt="Natacha" src={user.avatar} />}
        label={user.name}
        onDelete={onDeleteClick}
        style={{ marginRight: 4, marginBottom: 4 }}
    />
)
