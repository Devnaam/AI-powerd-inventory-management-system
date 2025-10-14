const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  headerAction,
  noPadding = false 
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-navy-100 transition-shadow duration-200 hover:shadow-md ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-navy-900">{title}</h3>}
            {subtitle && <p className="text-sm text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
