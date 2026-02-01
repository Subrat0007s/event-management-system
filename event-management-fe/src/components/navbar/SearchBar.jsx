export default function SearchBar({ value, onChange, placeholder = "Search events..." }) {
  return (
    <input
      className="input w-64 max-w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
