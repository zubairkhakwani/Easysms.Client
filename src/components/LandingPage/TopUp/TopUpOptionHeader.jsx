export default function TopUpOptionHeader({
  optionNumber,
  tag,
  tagVariant,
  description,
}) {
  return (
    <div className="topup-option-header">
      <div className="topup-option-header-badges">
        <span className="topup-option-number">Option {optionNumber}</span>
        <span className={`topup-option-tag topup-option-tag--${tagVariant}`}>
          {tag}
        </span>
      </div>
      <p className="topup-option-desc">{description}</p>
    </div>
  );
}
