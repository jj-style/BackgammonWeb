import React from 'react';
import {Alert} from 'react-bootstrap';

export const MyAlert = ({msg,showAlert,setShowAlert}) => {
    return (
        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
            <Alert.Heading>Alert!</Alert.Heading>
            <p>{msg}</p>
        </Alert>
    );
}