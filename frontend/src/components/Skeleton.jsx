import React from 'react';
import './Skeleton.css';

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-circle"></div>
      <div className="skeleton-text skeleton-title"></div>
    </div>
    <div className="skeleton-text skeleton-subtitle"></div>
    <div className="skeleton-text skeleton-line"></div>
  </div>
);

export const SkeletonStat = () => (
  <div className="skeleton-stat">
    <div className="skeleton-circle-lg"></div>
    <div className="skeleton-text skeleton-stat-value"></div>
    <div className="skeleton-text skeleton-stat-label"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="skeleton-table">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="skeleton-table-row">
        <div className="skeleton-text skeleton-cell"></div>
        <div className="skeleton-text skeleton-cell"></div>
        <div className="skeleton-text skeleton-cell"></div>
        <div className="skeleton-text skeleton-cell"></div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="skeleton-chart">
    <div className="skeleton-chart-bars">
      {[60, 80, 50, 90, 70].map((height, i) => (
        <div
          key={i}
          className="skeleton-bar"
          style={{ height: `${height}%` }}
        ></div>
      ))}
    </div>
  </div>
);
