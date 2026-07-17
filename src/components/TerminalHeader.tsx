type TerminalHeaderProps = {
  title: string
}

export function TerminalHeader({
  title,
}: TerminalHeaderProps) {
  return (
    <header className="terminal__header">
      <div
        className="terminal__controls"
        aria-hidden="true"
      >
        <span className="terminal__control terminal__control--close" />
        <span className="terminal__control terminal__control--minimize" />
        <span className="terminal__control terminal__control--maximize" />
      </div>

      <p className="terminal__title">{title}</p>

      <div
        className="terminal__header-space"
        aria-hidden="true"
      />
    </header>
  )
}