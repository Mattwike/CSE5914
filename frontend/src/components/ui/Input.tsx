import React from 'react'
import './ui.css'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...rest }, ref) => {
  const id = (rest && (rest as any).id) || React.useId()
  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label ? (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      ) : null}
      <input id={id} ref={ref} className={`input`} {...rest} />
    </div>
  )
})

export default Input
