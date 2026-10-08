import './Button.css';

function Button({ children, variant = 'primary', type = 'button', ...props }) {
  return (
    <button type={type} className={`app-button app-button--${variant}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
