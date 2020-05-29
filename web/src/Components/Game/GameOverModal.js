import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export const GameOverModal = ({show,handleCloseGameOver,winner}) => {
    return (
        <Modal show={show} onHide={handleCloseGameOver}>
            <Modal.Header closeButton>
                <Modal.Title>Game Over!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Congratulations {winner}, you won!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseGameOver}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}