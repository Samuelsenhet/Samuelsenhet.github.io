/** A plant and a bookend: furniture, so the short rows read as chosen. */
export function Plant() {
  return (
    <span className="lib-plant block">
      <i style={{ left: 'calc(var(--u) * 14px)', rotate: '-28deg' }} />
      <i style={{ left: 'calc(var(--u) * 21px)', height: 'calc(var(--u) * 42px)', rotate: '4deg' }} />
      <i style={{ left: 'calc(var(--u) * 28px)', rotate: '30deg' }} />
      <b />
    </span>
  );
}

export function Bookend() {
  return <span className="lib-bookend block" />;
}
