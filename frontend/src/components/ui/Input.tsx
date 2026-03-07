import React from 'react'
import './ui.css'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const Input: React.FC<InputProps> = ({ label, className = '', ...rest }) => {
  return (
    <div className={`w-full ${className}`.trim()}>
      {label ? <label className="mb-1" >{label}</label> : null}
      <input className={`input`.trim()} {...rest} />
    </div>
  )
}

export default Input
