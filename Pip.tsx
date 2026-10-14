export function Pip({ size = 160, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src={`/.netlify/images?url=/img/mascot.png&w=${size * 2}&fm=webp`}
      width={size}
      height={size}
      alt="Pip, the flame mascot"
      className={`mix-blend-multiply select-none ${className}`}
      draggable={false}
    />
  )
}
