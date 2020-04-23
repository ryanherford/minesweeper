import React, {useState} from 'react';
import './App.css';

const SmileyFace = (props) => {
  const [state, setState] = useState('') 
  // const otakuconfig = { // secret secret
  //   'c' : '(o v o)',
  //   'x' : '(x _ x)',
  //   'o' : '(- o -)',
  //   'w' : '(> 3 <)',
  //   'a' : '(* v *)',
  // }
  const emojiconfig = {
    'c' : '😀',
    'x' : '😵',
    'o' : '😧',
    'w' : '😎',
    'a' : '🤩'
  }

  const mouseDown = () => {
    setState('a');
  }
  const mouseUp = () => {
    setState('');
    props.reset()
  }
  return (
    <div className={`smiley`} onMouseDown={() => mouseDown()} onMouseUp={() => mouseUp()}>
        {emojiconfig[state || props.state] || ''}
    </div>
  );
}

export default SmileyFace;
