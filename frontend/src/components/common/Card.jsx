const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-card rounded-2xl shadow-md p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-text-primary">{title}</h3>}
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
