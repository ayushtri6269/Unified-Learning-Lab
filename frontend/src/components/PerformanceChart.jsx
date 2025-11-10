import React from 'react';
import './PerformanceChart.css';

const PerformanceChart = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Performance Trend</h3>
        <div className="chart-empty">
          <div className="empty-icon">📊</div>
          <p>No data available yet</p>
          <small>Take some tests to see your progress!</small>
        </div>
      </div>
    );
  }

  // Get last 10 results for the chart
  const recentResults = results.slice(-10).reverse();
  const maxScore = 100;

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        <span className="chart-icon">📈</span>
        Performance Trend
      </h3>

      <div className="chart-wrapper">
        <div className="chart-bars">
          {recentResults.map((result, idx) => (
            <div key={idx} className="bar-container">
              <div className="bar-wrapper">
                <div
                  className={`bar ${result.percentage >= 70 ? 'bar-pass' : 'bar-fail'}`}
                  style={{ height: `${(result.percentage / maxScore) * 100}%` }}
                >
                  <span className="bar-value">{result.percentage}%</span>
                </div>
              </div>
              <div className="bar-label">
                {result.category.substring(0, 3)}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color legend-pass"></span>
            <span>Pass (≥70%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-fail"></span>
            <span>Fail (&lt;70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
