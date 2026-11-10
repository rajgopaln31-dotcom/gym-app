interface Props {
  text: string;
  q: string;
}

/** Wraps the first match of the search query in <mark>, like the original hl(). */
export default function Highlight({ text, q }: Props) {
  const t = q.trim();
  if (!t) return <>{text}</>;
  const i = text.toLowerCase().indexOf(t.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + t.length)}</mark>
      {text.slice(i + t.length)}
    </>
  );
}
