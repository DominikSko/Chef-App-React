import { Typography } from '@material-ui/core'
import React from 'react'

	const Dashboard = props => {
        return(
            <div style={{display:'flex', fontWeight: 'bold', flexDirection: 'column', alignItems:'center', marginTop: 100}}>
                <Typography
                    align='center'
                    variant='h5'
                    color='secondary'
                >
                Dodawaj przepisy, dziel się ze znajomymi wspólnymi przepisami, pomagaj sobie w diecie, twórz listy zakupów !
                </Typography>
            </div>
        )
	}

export default Dashboard