import type {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  RefObject,
} from 'react'

type TerminalPromptProps = {
  currentPrompt: string
  commandInput: string
  commandInputRef: RefObject<HTMLInputElement | null>
  onSubmit: FormEventHandler<HTMLFormElement>
  onChange: ChangeEventHandler<HTMLInputElement>
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}

export function TerminalPrompt({
  currentPrompt,
  commandInput,
  commandInputRef,
  onSubmit,
  onChange,
  onKeyDown,
}: TerminalPromptProps) {
  return (
    <form
      className="terminal__command-line terminal__command-form"
      onSubmit={onSubmit}
    >
      <label
        className="terminal__prompt"
        htmlFor="terminal-command"
      >
        {currentPrompt}
      </label>

      <input
        ref={commandInputRef}
        id="terminal-command"
        className="terminal__input terminal__command-input"
        type="text"
        value={commandInput}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label="Enter a terminal command"
      />
    </form>
  )
}