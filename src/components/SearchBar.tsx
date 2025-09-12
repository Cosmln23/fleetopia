'use client'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = "Caută după destinație, tip cargo sau companie..." }: SearchBarProps) {
  return (
    <div className="w-full">
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 px-4 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/30 text-sm"
      />
    </div>
  )
}