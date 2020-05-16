import React from 'react';
import "./Spike.css";

export const Spike = ({index,pieces,direction,color,spikeClicked,source}) => {
    return (
        <div className="col-1">
            <div className={`spike triangle-${direction}-${color} triangle-${direction} ${source===index?"select":null}`} onClick={() => spikeClicked(index)}>
                {
                    [...Array(Math.abs(pieces)).keys()].map((value,i) => {
                        return <div key={i} className={`piece piece-${direction} circle circle-${pieces<0 ? "white" : "black"}`}></div>
                    })
                }
            </div>
        </div>
    );
}