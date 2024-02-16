import React, { useState } from 'react';
import './App.css';


function InputButton({onInputClick, value, type}) {

    const handleClick = () => onInputClick(value, type);


    return (<button className="input-btn" onClick={handleClick}>{value}</button>)
}

export default InputButton;