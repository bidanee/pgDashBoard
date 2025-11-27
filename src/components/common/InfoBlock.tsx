const InfoBlock = ({label, value}: {label: string; value: React.ReactNode;}) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition">
      <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
      <div className="text-gray-800 text-sm font-semibold">{value}</div>
    </div>
  );
}

export default InfoBlock