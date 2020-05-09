import React, { useState } from 'react';

const CreateGameForm = ({createGame, hideCreateForm}) => {

    const submit = (e) => {
        e.preventDefault();
        createGame(name);
    }

    const [name, setName] = useState("");

    return (
        <div className="row">
            <div className="col-6 mx-auto">
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="displayNameInput">Display Name</label>
                        <input id="displayNameInput" type="text" className="form-control" value={name} onChange={(e) => {setName(e.target.value)}}></input>
                    </div>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                        <button className="btn btn-danger" onClick={() => {hideCreateForm()}}>Cancel</button>
                        </div>
                        <div className="col-auto">
                        <button className="btn btn-success" onClick={(e) => {submit(e)}}>Create</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateGameForm;