import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Game from './Game';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';



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

ReactDOM.render(

    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
