// Reusable CSV dropzone: drag & drop or file picker, reads the file as text and
// hands the content up. The actual parsing/validation happens in the engine.

import { useRef, useState } from "react";

export function FileDrop({
  label,
  hint,
  busy,
  onFile,
}: {
  label: string;
  hint?: string;
  busy?: boolean;
  onFile: (csv: string, filename: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [name, setName] = useState<string | null>(null);

  function handle(file: File | undefined) {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => onFile(String(reader.result ?? ""), file.name);
    reader.readAsText(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={
        "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors " +
        (over ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/40")
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <div className="text-sm font-medium text-foreground">{busy ? "Caricamento…" : label}</div>
      <div className="mt-1 text-xs text-muted-foreground">
        {name ? `Selezionato: ${name}` : (hint ?? "Trascina un CSV qui o clicca per scegliere")}
      </div>
    </div>
  );
}
