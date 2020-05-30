import React, { useState } from 'react';
import {Modal, Button, Collapse} from 'react-bootstrap';
import {CirclePicker} from 'react-color';
import Switch from 'react-switch';

export const SettingsModal = ({show,cancelSettings,saveSettings, currentColour1, currentColour2, currentFlipH, players}) => {

    const [newColour1, setNewColour1] = useState(currentColour1);
    const [newColour2, setNewColour2] = useState(currentColour2);
    const [newFlipH, setNewFlipH] = useState(currentFlipH);
    const [showCP1, setShowCP1] = useState(false);
    const [showCP2, setShowCP2] = useState(false);

    const colourOptions = [ "#000000", "#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7",
                            "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
                            "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722" ]

    return (
        <Modal show={show} onHide={cancelSettings}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:"lightgray"}} >
                <div className="container">
                    <div className="row mb-3">
                        <div className="col">
                            {players[0]}'s pieces
                            <span className="piece circle mx-1" style={{backgroundColor:newColour1, cursor:"pointer"}} onClick={() => {setShowCP1(!showCP1)}} />
                        </div>
                        <div className="col">
                            <Collapse in={showCP1}>
                                <div>
                                    <CirclePicker onChangeComplete={(color, event) => {setNewColour1(color.hex)}} colors={colourOptions} />
                                </div>
                            </Collapse>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            {players[1]}'s pieces
                            <span className="piece circle mx-1" style={{backgroundColor:newColour2, cursor:"pointer"}} onClick={() => {setShowCP2(!showCP2)}} />
                        </div>
                        <div className="col">
                            <Collapse in={showCP2}>
                                <div>
                                    <CirclePicker onChangeComplete={(color, event) => {setNewColour2(color.hex)}} colors={colourOptions} />
                                </div>
                            </Collapse>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            Flip horizontal
                        </div>
                        <div className="col">
                            <Switch onChange={() => {setNewFlipH(!newFlipH)}} checked={newFlipH} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => {cancelSettings()}}>
                    Cancel
                </Button>
                <Button variant="success" onClick={() => {saveSettings(newColour1,newColour2,newFlipH)}}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}