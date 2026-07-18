function Select({id, label, helper, children, className = "", ...props}) {
  return (
    <label className={`field ${className}`.trim()} htmlFor={id}>
      <span className="field__label">{label}</span>
      <select className="field__control" id={id} {...props}>
        {children}
      </select>
      {helper ? <span className="field__helper">{helper}</span> : null}
    </label>
  );
}

export default Select;
