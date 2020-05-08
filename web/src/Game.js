import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./bootstrap.min.css";
import "./Game.css";

const Spike = ({index}) => {
    return (
        <div className="col-1">
            <div className={`bg-spike triangle-${index<12 ? "down" : "up"}`}/>
        </div>
    );
}

const Game = () => {

    let { gameCode } = useParams();

    const [board, setBoard] = useState([]);
    const [start, setStart] = useState(false);

     useEffect(() => {
         setTimeout(() => {
            fetch(`http://localhost:5000/api/game/${gameCode}`, {method:"GET"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBoard(data.board);
                setStart(data.players.length === 2);
            })
         }, 1000);
     });

    return (
        <div className="container-fluid">
            <h1>Game {gameCode}</h1>
            {!start ? 
                <div className="alert alert-danger" role="alert">
                    Waiting for other player...
                </div>
            :
            null
            }
            <div className="row">

            
            {board.map((value, index) => {
                return <Spike key={index} index={index} />
            })}
            </div>
        </div>
    );
}

export default Game;