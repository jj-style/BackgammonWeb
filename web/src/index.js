import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Components/Home/Home';
import Game from './Components/Game/Game';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => {

    const initialState = {
        gameCode: null,
        name: null
    }
    
    const [state, dispatch] = useReducer(reducer, initialState);
    
    function reducer(state, action) {
        switch (action.type) {
            case "JOIN":
                return Object.assign({}, state, {gameCode:action.gameCode, name: action.name});
            case "CREATE":
                return Object.assign({}, state, {gameCode:action.gameCode, name: action.name});
            default:
                return state;
        }
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home dispatch={dispatch} />
                </Route>
                <Route path="/game">
                    <Game gameCode={state.gameCode} name={state.name} />
                </Route>
            </Switch>
        </Router>
    );
}

const Application = () => {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

ReactDOM.render(<Application/>, document.getElementById('root'));