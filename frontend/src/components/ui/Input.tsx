import React from 'react'
import './ui.css'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const Input: React.FC<InputProps> = ({ label, className = '', ...rest }) => {
  return (
    <div style={{ width: '100%' }}>
      {label ? <label style={{ display: 'block', marginBottom: '6px' }}>{label}</label> : null}
      <input className={`input ${className}`.trim()} {...rest} />
    </div>
  )
}

export default Input
