
const BlurCircle = ({ top = 'auto', left = 'auto', right = 'auto', bottom = 'auto' }) => {
  return (
    <div
      className="pointer-events-none absolute z-0 aspect-square h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl sm:h-40 sm:w-40 md:h-56 md:w-56"
      style={{ top, left, right, bottom }}
    />
  )
}

export default BlurCircle
