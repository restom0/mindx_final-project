function Button({
                  children,
                  className = "",
                  icon,
                  type = "button",
                  variant = "primary",
                  size = "md",
                  ...props
                }) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`.trim()}
      type={type}
      {...props}
    >
      {icon ? <span className="button__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
