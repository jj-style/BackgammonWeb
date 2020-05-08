import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import './bootstrap.min.css'
import JoinGameForm from './JoinGameForm';



function App() {
    let history = useHistory("");

    function enterGame(gameCode) {
        history.replace(`/game/${gameCode}`);
    }

    function joinGame(code) {
        console.log(`attempting to join game ${code}`);
        fetch(`http://localhost:5000/api/game/join?gameCode=${code}`, 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"}
            }
        )
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.error)
                console.log(data.error);
            else
                enterGame(code);
        });
    }

    function createGame() {
        console.log("creating new game");
        fetch("http://localhost:5000/api/game/create")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            enterGame(data.gameCode);
        });
    }

    const [showJoin, setShowJoin] = useState(false);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mx-auto">
                    <h3>Backgammon</h3>
                </div>
            </div>
            <div className="row">
                <div className="mx-auto">
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-info" onClick={() => createGame()}>Create Game</button>
                        <button type="button" className="btn btn-outline-info" onClick={() => setShowJoin(true)}>Join Game</button>
                    </div>
                </div>
            </div>
            
            { showJoin ? <JoinGameForm joinGame={joinGame} hideJoinForm={() => setShowJoin(false)}/> : null }
        </div>
    );
}

export default App;
