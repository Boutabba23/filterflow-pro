import React from 'react';
import './Alert.css';

const Alert = ({ type, message }) => {
  return (
    <div className={`alert alert-${type}`}>
      {type === 'danger' && '⚠️ '}
      {type === 'success' && '✅ '}
      {type === 'info' && 'ℹ️ '}
      {message}
    </div>
  );
};

export default Alert;
