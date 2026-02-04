export default function Tooltip({ text }) {
  return (
    <span className="relative group ml-1">
      <span className="text-gray-400 cursor-help">ⓘ</span>

      <span className="
      absolute left-1/2 -translate-x-1/2 top-6
        hidden group-hover:block
        whitespace-nowrap
        bg-gray-900 text-white text-xs
        px-2 py-1 rounded-md shadow-lg
        z-50
      ">
        {text}
      </span>
    </span>
  );
}
