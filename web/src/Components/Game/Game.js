import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spike } from './Spike';
import io from 'socket.io-client';
import "../../bootstrap.min.css";
import "./Game.css";
import {Alert} from 'react-bootstrap';


const socket = io.connect('http://localhost:5000');

const Game = ({gameCode, name}) => {

    const history = useHistory();
    
    if (gameCode === null || name === null) {
        history.push("/");
    }

    // Game data
    const [board, setBoard] = useState([]);
    const [start, setStart] = useState(false);
    const [players, setPlayers] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [thisPlayer, setThisPlayer] = useState(null);
    const [dice, setDice] = useState([]);
    const [takenPieces, setTakenPieces] = useState([]);
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [removedPieces, setRemovedPieces] = useState([])

    // Game flow
    const [rolled, setRolled] = useState(false);
    const [source, setSource] = useState(null);
    const [showCannotMove, setShowCannotMove] = useState(false);

    const diceFace = [
        require("../../Assets/Dice/1.png"),
        require("../../Assets/Dice/2.png"),
        require("../../Assets/Dice/3.png"),
        require("../../Assets/Dice/4.png"),
        require("../../Assets/Dice/5.png"),
        require("../../Assets/Dice/6.png"),
    ];

    useEffect(() => {
        function subscribeToGame(code) {
            socket.emit("SUBSCRIBE", code);
        }
        subscribeToGame(gameCode);
        return () => { socket.emit("UNSUBSCRIBE", gameCode, name) };
    }, [gameCode,name]);

    useEffect(() => {
        document.title = `${currentPlayer}'s turn`;
    }, [currentPlayer]);

    useEffect(() => {

        function setData(data) {
            console.log(data);
            setBoard(data.board);
            setPlayers(data.players)
            setStart(data.players.length === 2);
            setCurrentPlayer( (data.players.length === 2) ? data.players[data.current_player] : "waiting for player's to join");
            setThisPlayer(data.players.indexOf(name));
            setDice(data.dice);
            setRolled(data.dice.length!==0);
            setTakenPieces(data.taken_pieces);
            setRemovedPieces(data.removed_pieces);
        }

        socket.on("SUBSCRIBED", data => {
            console.log("subscribed callback");
            setData(JSON.parse(data));
        });

        socket.on("ROLLED", data => {
            console.log("new data callback");
            setData(JSON.parse(data));
            setRolled(true);
        });

        socket.on("MOVED", data => {
            console.log("piece moved callback");
            setData(JSON.parse(data));
            setSource(null);
        });

        socket.on("ENDEDTURN", data => {
            console.log("Ended turn callback");
            setData(JSON.parse(data));
        });

    }, [name, gameCode]);

    function getAllPossibleMoves() {
        fetch(`api/game/${gameCode}/possibleMoves`)
        .then(res => res.json())
        .then(data => {
            console.log("all moves",data.allMoves);
            setPossibleMoves(data.allMoves);
            if (currentPlayer === players[thisPlayer]) {
                if (Object.keys(data.allMoves).length === 0) {
                    console.log("No moves possible, ending turn");
                    setShowCannotMove(true);
                    setTimeout(() => {
                        setRolled(false);
                        socket.emit("ENDTURN", gameCode);
                    }, 3000);
                } 
            }
        });
    }

    function rollDice() {
        socket.emit("ROLL", gameCode);
        getAllPossibleMoves();
    }

    function spikeClicked(index) {
    
        console.log(`Cliked spike ${index}`);
        console.log("Possible Moves:", possibleMoves);
        if (currentPlayer === players[thisPlayer]) {
            if (rolled) {
                if (source === null) {
                    if (index in possibleMoves) {
                        console.log("valid source");
                        setSource(index);
                    } else {
                        console.log(`Cannot select spike ${index} as a source`);
                    }
                } else { // dest
                    if (possibleMoves[source].includes(index)) {
                        console.log("valid destination");
                        socket.emit("MOVE", gameCode, source, index);
                        if (dice.length !== 1)
                            getAllPossibleMoves();
                    } else {
                        console.log(`Cannot select spike ${index} as a destination`)
                        setSource(null);
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
                <div className="row">
                    <div className="mx-auto">
                    <Alert variant="danger" show={showCannotMove} onClose={() => setShowCannotMove(false)} dismissible>
                        <Alert.Heading>Alert!</Alert.Heading>
                        <p>No moves possible... skipping turn.</p>
                    </Alert>
                    </div>
                </div>
                <div className="row">
                    <div className={`removed-pieces mx-auto col-10 my-1 py-3 ${source !== null && possibleMoves[source].includes("off") ?"rmv-pos-dest":null}`} onClick={() => spikeClicked("off")} >
                        {
                        removedPieces.map((value, index) => {
                            return Array(value).map((n,i) => {
                                return <div key={i} className={`removed-piece circle circle-${index===0 ? "white" : "black"}`} />
                            });
                        })}
                    </div>
                </div>
                <div className="board">
                    <div className="row" style={{marginBottom:"70px"}}>
                        {board.slice(0,12).map((value, index) => {
                            return <Spike key={index} index={index} pieces={value} direction="down" color={index%2===0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves} />
                        })}
                    </div>
                    <div className="row">
                        {board.slice(12,24).reverse().map((value, index) => {
                            return <Spike key={11+index} index={23-index} pieces={value} direction="up" color={index%2!==0 ? "dark" : "light" } spikeClicked={spikeClicked} source={source} possibleMoves={possibleMoves}/>
                        })}
                    </div>
                </div>
                <div className="row">
                    <div className={`takenPieces mx-auto col-4 my-1 py-3 ${source === -1 || source === 24 ? "select" : "null" }`}>
                        {
                        takenPieces.map((value, index) => {
                            return <div key={index} className={`takenPiece circle circle-${value<0 ? "white" : "black"}`} onClick={() => spikeClicked(thisPlayer === 0 ? 24 : -1)} />
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default Game;