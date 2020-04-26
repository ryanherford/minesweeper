import React, {useState} from 'react';

const SmileyFace = (props) => {
  const [state, setState] = useState('') 
  const mouseDown = () => { setState('a');}
  const mouseUp = () => { setState(''); props.reset()}
  return (
    <div className={`smiley`} onMouseDown={() => mouseDown()} onMouseUp={() => mouseUp()}>
        {props.config[state || props.state] || ''}
    </div>
  );
}

export default SmileyFace;
