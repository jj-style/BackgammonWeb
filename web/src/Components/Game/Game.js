import React, { useState, useEffect } from 'react';
import "../../bootstrap.min.css";
import "./Game.css";

import { useHistory } from 'react-router-dom';

const Spike = ({index,pieces,direction,color,spikeClicked}) => {

    return (
        <div className="col-1">
            <div className={`spike triangle-${direction}-${color} triangle-${direction}`} onClick={() => spikeClicked(index)}>
                {
                    [...Array(Math.abs(pieces)).keys()].map((value,i) => {
                        return <div key={i} className={`piece piece-${direction} circle circle-${pieces<0 ? "white" : "black"}`}></div>
                    })
                }
            </div>
        </div>
    );
}

const Game = ({gameCode, name}) => {
    const history = useHistory();
    
    if (gameCode === null || name === null) {
        history.push("/");
    }

    const [board, setBoard] = useState([]);
    const [start, setStart] = useState(false);
    const [players, setPlayers] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [thisPlayer, setThisPlayer] = useState(null);
    const [dice, setDice] = useState([]);

    // Game flow stuff
    const [rolled, setRolled] = useState(false);
    const [source, setSource] = useState(null);
    const [dest, setDest] = useState(null);

    const diceFace = [
        require("../../Assets/Dice/1.png"),
        require("../../Assets/Dice/2.png"),
        require("../../Assets/Dice/3.png"),
        require("../../Assets/Dice/4.png"),
        require("../../Assets/Dice/5.png"),
        require("../../Assets/Dice/6.png"),
    ];

    useEffect(() => {

        const fetchGameData = async () => {
            await fetch(`http://localhost:5000/api/game/${gameCode}`, {method:"GET"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBoard(data.board);
                setPlayers(data.players)
                setStart(data.players.length === 2);
                setCurrentPlayer( (data.players.length === 2) ? data.players[data.current_player] : "waiting for player's to join");
                setThisPlayer(data.players.indexOf(name));
                setDice(data.dice);
            });
        } 
        fetchGameData();
        let timer = setInterval(() => fetchGameData(), 3000);
        return () => { clearInterval(timer); timer=null; }
    },[gameCode, name]);

    useEffect(() => {
        document.title = `${currentPlayer}'s turn`;
    },[currentPlayer]);

    useEffect(() => {
        if (source !== null && dest !== null) { // both have been so selected so must be a valid move
            fetch(`http://localhost:5000/api/game/${gameCode}?fromIndex=${source}&toIndex=${dest}`, {method:"POST"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setRolled(null);
                setSource(null);
                setDest(null);
            });
        }
    },[source, dest, gameCode]);

    function rollDice() {
        fetch(`http://localhost:5000/api/game/${gameCode}/roll`, {method:"POST"})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setRolled(true);
        });
    }

    function spikeClicked(index) {

        const validSource = (index) => {
            if (board[index] < 0 && thisPlayer === 0) { // white
                return true;
            } else {
                if (board[index] > 0 && thisPlayer === 1) { // black
                    return true;
                } else {
                    return false;
                }
            }
        }

        const validDest = (source, index) => {
            if (thisPlayer === 0) { // white
                if (board[index] <= 0 || board[index] === 1) {
                    // if dest is dice roll away from source
                    if (dice.includes(Math.abs(source-index)) && index < source ) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false;
                }
            } else { // black
                if (board[index] >= 0 || board[index] === -1) {
                    // if dest is dice roll away from source
                    if (dice.includes(Math.abs(source-index)) && index > source ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }

        console.log(`Cliked spike ${index}`);
        if (currentPlayer === players[thisPlayer]) {
            if (rolled) {
                if (source === null) {
                    if (validSource(index)) { // validation in this if statement
                        console.log("valid source");
                        setSource(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a source`);
                    }
                } else { // dest
                    if (validDest(source,index)) {
                        console.log("valid destination");
                        setDest(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a destination`)
                    }
                }
            } else {
                console.log("Please roll first");
            }
        } else {
            console.log("not your turn");
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mx-auto">
                    <h1>Game {gameCode}</h1>
                </div>
            </div>
            {!start ? 
                <div className="row">
                    <div className="mx-auto alert alert-danger" role="alert">
                        Waiting for other player...
                    </div>
                </div>
            :
            <div className="mainGame">
                <div className="row">
                    <div className="mx-auto">
                        <h4>
                            { thisPlayer === 0 ? <strong>{players[0]}</strong> : players[0]}
                            (white) vs (black)  
                            { thisPlayer === 1 ? <strong>{players[1]}</strong> : players[1]}
                        </h4>
                        { (currentPlayer === players[thisPlayer] && !rolled) ?
                            <button type="button" className="btn btn-dark roll-btn" onClick={() => {rollDice();}}>Roll</button>
                        :
                        null
                        }
                        { (rolled && dice.length > 0) ?
                            dice.map((value,index) => {
                                return (
                                    <img key={index} src={diceFace[value-1]} className="img img-fluid dice-img" alt={`dice face showing ${value}`}  />
                                );
                            })
                            :
                            null
                        }
                    </div>
                </div>
                <div className="board">
                    <div className="row" style={{marginBottom:"70px"}}>
                        {board.slice(0,12).map((value, index) => {
                            return <Spike key={index} index={index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} />
                        })}
                    </div>
                    <div className="row">
                        {board.slice(12,24).reverse().map((value, index) => {
                            return <Spike key={11+index} index={23-index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} />
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Game;