function Textarea({id, label, helper, className = "", ...props}) {
  return (
    <label className={`field ${className}`.trim()} htmlFor={id}>
      <span className="field__label">{label}</span>
      <textarea className="field__control field__control--textarea" id={id} {...props} />
      {helper ? <span className="field__helper">{helper}</span> : null}
    </label>
  );
}

export default Textarea;
