import './SectionTitle.css';

function SectionTitle({ title, subtitle }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

export default SectionTitle;
