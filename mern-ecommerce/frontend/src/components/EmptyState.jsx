const EmptyState = ({ title = "Nothing here yet", subtitle = "", action = null }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7m5-5v5m0 0h-5m5 0l-6-6"
        />
      </svg>
    </div>
    <h3 className="text-gray-700 font-semibold">{title}</h3>
    {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
