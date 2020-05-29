import React, { useState } from 'react';
import {Modal, Button, Collapse} from 'react-bootstrap';
import {CirclePicker} from 'react-color';

export const SettingsModal = ({show,cancelSettings,saveSettings, currentColour1, currentColour2}) => {

    const [newColour1, setNewColour1] = useState(currentColour1);
    const [newColour2, setNewColour2] = useState(currentColour2);
    const [showCP1, setShowCP1] = useState(false);
    const [showCP2, setShowCP2] = useState(false);

    return (
        <Modal show={show} onHide={cancelSettings}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:"lightgray"}} >
                <div className="container">
                    <div className="row mb-3">
                        <div className="col">
                            Player 1 Pieces
                            <span className="piece circle mx-1" style={{backgroundColor:newColour1, cursor:"pointer"}} onClick={() => {setShowCP1(!showCP1)}} />
                        </div>
                        <div className="col">
                            <Collapse in={showCP1}>
                                <div>
                                    <CirclePicker onChangeComplete={(color, event) => {setNewColour1(color.hex)}}/>
                                </div>
                            </Collapse>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            Player 2 Pieces
                            <span className="piece circle mx-1" style={{backgroundColor:newColour2, cursor:"pointer"}} onClick={() => {setShowCP2(!showCP2)}} />
                        </div>
                        <div className="col">
                            <Collapse in={showCP2}>
                                <div>
                                    <CirclePicker onChangeComplete={(color, event) => {setNewColour2(color.hex)}}/>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => {cancelSettings()}}>
                    Cancel
                </Button>
                <Button variant="success" onClick={() => {saveSettings(newColour1,newColour2)}}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}