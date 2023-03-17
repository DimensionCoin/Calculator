import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleClick = (value) => {
    setResult(result + value);
  };

  const handleCalculate = () => {
    if (result === '0*0') {
      navigate('/main');
    } else {
      try {
        setResult(eval(result).toString());
      } catch (error) {
        setResult('Error');
      }
    }
  };

  const handleClear = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="calculator bg-white p-6 rounded-lg shadow-lg">
    <div className="display bg-black text-white text-right text-3xl p-4 mb-6 rounded-lg">{result}</div>
    <div className="grid grid-cols-4 gap-6">
      <button onClick={() => handleClick('7')} className="btn">7</button>
      <button onClick={() => handleClick('8')} className="btn">8</button>
      <button onClick={() => handleClick('9')} className="btn">9</button>
      <button onClick={() => handleClick('/')} className="btn">/</button>
      <button onClick={() => handleClick('4')} className="btn">4</button>
      <button onClick={() => handleClick('5')} className="btn">5</button>
      <button onClick={() => handleClick('6')} className="btn">6</button>
      <button onClick={() => handleClick('*')} className="btn">*</button>
      <button onClick={() => handleClick('1')} className="btn">1</button>
      <button onClick={() => handleClick('2')} className="btn">2</button>
      <button onClick={() => handleClick('3')} className="btn">3</button>
      <button onClick={() => handleClick('-')} className="btn">-</button>
      <button onClick={() => handleClick('0')} className="btn">0</button>
      <button onClick={() => handleClick('.')} className="btn">.</button>
      <button onClick={handleCalculate} className="btn">=</button>
      <button onClick={() => handleClick('+')} className="btn">+</button>
      <button onClick={handleClear} className="col-span-4 btn">C</button>
    </div>
  </div>
</div>
  );
};

export default Calculator;
