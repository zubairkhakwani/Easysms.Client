export function AdminPage({ title, subTitle, children }) {
  return (
    <div className="ph-page">
      {title && (
        <div className="um-header">
          <div>
            <div className="um-page-title">{title}</div>
            <div className="um-page-sub">{subTitle}</div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
