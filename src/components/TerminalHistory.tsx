import type { TerminalEntry } from '../types/terminal'

type TerminalHistoryProps = {
  entries: TerminalEntry[]
}

export function TerminalHistory({
  entries,
}: TerminalHistoryProps) {
  return (
    <div
      className="terminal__history"
      aria-live="polite"
    >
      {entries.map((entry) => (
        <div
          className="terminal__entry"
          key={entry.id}
        >
          <div className="terminal__command-line">
            <span className="terminal__prompt">
              {entry.prompt}
            </span>

            <span>{entry.command}</span>
          </div>

          {entry.output !== null && (
            <div className="terminal__entry-output">
              {entry.output}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}