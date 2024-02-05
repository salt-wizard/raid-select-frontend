import {React, useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Collapse, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import useWebSocket from 'react-use-websocket';

import './RaidScreen.css';

// URL for Streamer.Bot Web Socket
const RAID_WS_URL = 'ws://127.0.0.1:10001/raid'

const testRaidJsonList = [
    {
        "name": "thezikes",
        "pfp": "https://static-cdn.jtvnw.net/jtv_user_pictures/60f06ae5-0da3-41e3-b1bf-90494d811117-profile_image-300x300.png"
    },
    {
        "name": "bodegarrat",
        "pfp": "https://static-cdn.jtvnw.net/jtv_user_pictures/0775e45a-9f6e-448b-8b57-35304a86b1d3-profile_image-300x300.png"
    },
    {
        "name": "maplewinters",
        "pfp": "https://static-cdn.jtvnw.net/jtv_user_pictures/73d95d89-1152-4d36-959c-92f55d9c2de4-profile_image-300x300.png"
    },
    {
        "name": "vinesauce",
        "pfp": "https://static-cdn.jtvnw.net/jtv_user_pictures/b5dc0add-a5cc-47ea-8562-b23fee4b4267-profile_image-300x300.png"
    },
]


const RaidScreen = () => {
    const [enableRedeem, setEnableRedeem] = useState(false);
    const [manualTextEntered, setManualTextEntered] = useState(true);
    const [raidInProgress, setRaidInProgress] = useState(false);
    const [manualTarget, setManualTarget] = useState("");
    const [raidStatus, setRaidStatus] = useState("Not Enabled");

    // The raid list will be provided through this state
    const [raidList, setRaidList] = useState([]);

    // Establish a web socket connection and look for latest messages.
    const {sendMessage, lastMessage} = useWebSocket(RAID_WS_URL, {
            onOpen: () => { 
                console.log('WebSocket connection established.'); 
            }, 
            share: true
        });


    /*
        Toggle the redeems on or off depending on which button is clicked.
        If the redeem is being toggled, it will request for a new redeem.
    */
    function toggleRedeemStatus(){
        setEnableRedeem(!enableRedeem);
        !enableRedeem ? setRaidStatus("Waiting For Input...") : setRaidStatus("Not Enabled");
    }

    /*
        Enable the manual raid button if there is input in the text box
    */
    function handleManualTarget(event){
        if(event.target.value){
            setManualTextEntered(false);
        } else {
            setManualTextEntered(true);
        }

        setManualTarget(event.target.value);
    }

    /*
        Start the random raid
    */
    function startRandomRaid(event){
        setRaidInProgress(!raidInProgress);
        setRaidStatus("Raiding Random User");
        // Notify streamer.bot that you want to raid a random person
        var json = {
            "action": "raid",
            "target": "RANDOM"
        }
        sendMessage(JSON.stringify(json));
    }

    /*
        START A TARGETED RAID (SUGGESTED)
        - Set the raid in progress to true
        - Set the raid status to the user targeted
        - Send a message over WS to indicate the raid target
    */
    function startTargetedRaid(e){
        // The username is the target value
        var user = e.target.value;
        setRaidInProgress(!raidInProgress);
        setRaidStatus("Manually Raiding " + user)
        var json = {
            "action": "raid",
            "target": user
        }
        sendMessage(JSON.stringify(json));

    }

    /*
        START A TARGETED RAID (INPUT)
        - Set the raid in progress to true
        - Set the raid status to the user targeted
        - Send a message over WS to indicate the raid target
    */
    function startManualRaid(e){
        setRaidInProgress(!raidInProgress);
        setRaidStatus("Manually Raiding " + manualTarget)
        var json = {
            "action": "raid",
            "target": manualTarget
        }
        sendMessage(JSON.stringify(json));
    }

    /*
        CANCEL A RAID
        - Set the raid in progress to false
        - Reset the raid status
        - Send a message over WS to indicate raid canceled
    */
    function cancelRaid(event){
        setRaidInProgress(!raidInProgress);
        setRaidStatus("Waiting For Input...")
        sendMessage('CANCELRAID');
    }

    /*
        Handler for any messages that arrive from Streamer.bot
    */
    useEffect(()=>{
        if(lastMessage != null){
            console.log(lastMessage.data);
            setRaidList(JSON.parse(lastMessage.data));
        }
    },[lastMessage]);

    return(
        <div>
            <Box className="raid-box">
                <Button className="raid-button" color="success" variant="contained" disabled={enableRedeem} onClick={toggleRedeemStatus}>Enable</Button>
                <Button className="raid-button" color="error" variant="contained" disabled={!enableRedeem} onClick={toggleRedeemStatus}>Disable</Button>
            </Box>
            <Box className="raid-box">
                <Typography>Raid Status - {raidStatus}</Typography>
            </Box>
            {enableRedeem ? 
            <div>
                <Box className="raid-box">
                    <Button className="raid-button" color="success" variant="contained" disabled={raidInProgress} onClick={startRandomRaid}>Random Raid</Button>
                    <Button className="raid-button" color="error" variant="contained" disabled={!raidInProgress} onClick={cancelRaid}>Cancel Raid</Button>
                    <Button className="raid-button" color="info" variant="contained" disabled={!raidInProgress} ><LiveTvIcon/></Button>
                </Box>
                <Box className="raid-box">
                    <TextField 
                        className="raid-button " 
                        id="standard-basic" 
                        label="Manual Raid Target" 
                        variant="outlined"
                        onChange={handleManualTarget}
                    /> 
                    <Button 
                        className="raid-button manual-raid-button" 
                        variant="outlined"
                        // The button should be disabled if there is a raid in progress or the text input is empty
                        disabled={raidInProgress || manualTextEntered}
                        onClick={startManualRaid}
                    >
                        Raid
                    </Button>
                </Box>
                <Box className="buffer" />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>Suggested Streamers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                    
                
                {raidList !== null ? raidList.map((raidTarget) => {
                    return (
                        <Stack className="raid-box" key={raidTarget.name + "-key"} direction="row">
                            <Box><Button disabled={raidInProgress} value={raidTarget.name} className="raid-button" color="success" variant="outlined" onClick={startTargetedRaid}>Raid</Button></Box>
                            <Box><Button value={raidTarget.name} className="raid-button" color="error" variant="outlined"><DoNotDisturbIcon /></Button></Box>
                            <img 
                                style={{
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    background: "red",
                                    display: "block",
                                    marginRight: "10px"
                                }} 
                                src={raidTarget.pfp} 
                                alt="streamer"
                            />
                            <Box 
                            sx={{ width: "26ch", marginTop: "5px" }}
                            ><Typography>{raidTarget.name}</Typography></Box>
                        </Stack>
                    );
                })
            : null
            }
                </AccordionDetails>
            </Accordion>
            </div>
            : 
            null
            }
        </div>
    );
}

export default RaidScreen