import React from 'react';
import { useParams } from 'react-router-dom';
import "./bootstrap.min.css";

const Game = () => {

    let { gameCode } = useParams();

    return (
        <div className="container-fluid">
            <h1>Game {gameCode}</h1>
        </div>
    );
}

export default Game;