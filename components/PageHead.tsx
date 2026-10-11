/** A page's opening: a letterspaced kicker, the serif title, and a lede (sen-3d-resume's .intro voice). */
export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <>
      <p className="kicker rv">{kicker}</p>
      <h1 className="page-title rv">{title}</h1>
      {children && <div className="lede rv">{children}</div>}
    </>
  );
}
