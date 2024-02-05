import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import RaidScreen from './RaidScreen/RaidScreen';

const OBSDock = () => {
    const [tabValue, setTabValue] = React.useState('one');

    const handleChange = (e, newValue) => {
        //console.log(e);
        setTabValue(newValue);
    };

    return(
        <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab value="one" label="Raid"/>
                    </Tabs>
                </Box>
                { tabValue === "one" ?
                <RaidScreen />
                : null }
            </Box>
            
        </div>
    );
}

export default OBSDock;