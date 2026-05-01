function Input({id, label, helper, className = "", ...props}) {
  return (
    <label className={`field ${className}`.trim()} htmlFor={id}>
      <span className="field__label">{label}</span>
      <input className="field__control" id={id} {...props} />
      {helper ? <span className="field__helper">{helper}</span> : null}
    </label>
  );
}

export default Input;
