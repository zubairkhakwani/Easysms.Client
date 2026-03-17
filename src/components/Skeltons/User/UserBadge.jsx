//Css
import "./UserBadge.css";
export const UserBadgeSkeleton = () => {
  return (
    <div className="nav-user-badge nav-user-badge--skeleton">
      <div className="nav-user-avatar skeleton-pulse skeleton-avatar" />
      <div className="nav-user-info">
        <div className="skeleton-pulse skeleton-name" />
        <div className="skeleton-pulse skeleton-balance" />
      </div>
      <div className="nav-user-divider" />
      <div className="skeleton-pulse skeleton-arrow" />
    </div>
  );
};
