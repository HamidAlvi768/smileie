import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTooth, faBroom, faCamera, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faClone } from '@fortawesome/free-solid-svg-icons';
import { transform } from 'lodash';

// Example bar data (replace with real data as needed)
const defaultBarData = {
  aligners: [
    { label: 'GO', color: 'green', percentage: 67, scans: 4 },
    { label: 'NO-GO/GO-BACK', color: 'red', percentage: 33, scans: 2 }
  ],
  hygiene: [
    { label: 'No issues', color: 'green', percentage: 80, scans: 5 },
    { label: 'At least one issue', color: 'red', percentage: 20, scans: 1 }
  ],
  scan: [
    { label: 'On time', color: 'green', percentage: 75, scans: 6 },
    { label: 'Late', color: 'red', percentage: 25, scans: 2 }
  ]
};

const BAR_TITLES = {
  aligners: 'Aligners',
  hygiene: 'Hygiene',
  scan: 'Scan compliance',
};

const BAR_ICONS = {
  aligners: <FontAwesomeIcon icon={faTooth} color="#607181" />,
  hygiene: <FontAwesomeIcon icon={faBroom} color="#607181" />,
  scan: <FontAwesomeIcon icon={faCamera} color="#607181" />,
};

function BarTooltip({ title, segments, left }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: left,
        top: -110,
        zIndex: 10,
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        boxShadow: '0 2px 12px rgba(22, 177, 199, 0.10)',
        padding: '5px 22px 12px 22px',
        minWidth: 220,
        minHeight: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, color: '#607181', marginBottom: 10, textAlign: 'center' }}>{title}</div>
      <div style={{ width: '100%' }}>
        {segments.map((seg, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: idx === segments.length - 1 ? 0 : 6 }}>
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: seg.color === 'green' ? '#16b77c' : '#e74c3c',
              marginRight: 8,
              marginLeft: 2,
            }} />
            <span style={{ fontWeight: 700, color: seg.color === 'green' ? '#16b77c' : '#e74c3c', fontSize: 12, marginRight: 4 }}>{seg.label}:</span>
            <span style={{ fontWeight: 700, color: '#222', fontSize: 12, marginRight: 4 }}>{seg.percentage}%</span>
            <span style={{ color: '#8ca0b3', fontSize: 10, fontWeight: 400 }}>({seg.scans} scan(s))</span>
          </div>
        ))}
      </div>
      {/* Caret */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: -10,
        transform: 'translateX(-50%)',
        width: 22,
        height: 12,
        overflow: 'visible',
        pointerEvents: 'none',
      }}>
        <svg width="22" height="12" viewBox="0 0 22 12" style={{ display: 'block' }}>
          <polygon points="0,0 22,0 11,12" fill="#fff" stroke="#e0e0e0" />
        </svg>
      </div>
    </div>
  );
}

function renderBar(barKey, segments, label, showTooltip, setShowTooltip, barRef) {
  return (
    <div
      ref={barRef}
      style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0, padding: '0 8px', gap: 4, border: 'none', position: 'relative' }}
      onMouseEnter={() => setShowTooltip(barKey)}
      onMouseLeave={() => setShowTooltip(null)}
    >
      <span style={{ fontSize: 16, marginBottom: 4, color: '#607181', border: 'none' }}>{label}</span>
      <div style={{ width: '100%', height: 12, borderRadius: 6, overflow: 'hidden', display: 'flex', background: '#e9ecef', border: 'none', cursor: 'pointer' }}>
        {segments.map((seg, idx) => (
          <div
            key={idx}
            style={{
              width: `${seg.percentage}%`,
              background: seg.color === 'green' ? '#16b77c' : '#e74c3c',
              height: '100%'
            }}
          />
        ))}
      </div>
      {showTooltip === barKey && (
        <BarTooltip
          title={BAR_TITLES[barKey]}
          segments={segments}
          left={barRef.current ? `${barRef.current.offsetWidth / 2 - 110}px` : '50%'}
        />
      )}
    </div>
  );
}

const VisTimeline = ({ timelinePoints, hygienePoints, height, barData, onCompare, minimal, onShowStats, selectedDate, onDateChange, progressPercent, startDate, endDate }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const alignersBarRef = useRef(null);
  const hygieneBarRef = useRef(null);
  const scanBarRef = useRef(null);

  // Date navigation state
  const [compare, setCompare] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null); // 'aligners', 'hygiene', 'scan'

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert your points to vis.js timeline items format
    const items = new DataSet([
      ...timelinePoints.map((point, idx) => ({
        id: idx,
        content: point.alignerIndex,
        start: new Date(point.dataObjectLabel),
        type: 'point',
        title: point.tooltip || point.alignerIndex,
        height: 50,
        style: 'transform: translateY(-10px)',
      })),
    ]);

    // Initialize the timeline with tooltip options
    timelineRef.current = new Timeline(
        containerRef.current,
        items,
        {
          height: height || 500,
          tooltip: {
            followMouse: true,
            overflowMethod: 'none',
          },
          orientation: {
            axis: 'top',
            item: 'top',
          }
        }
      );

    // Cleanup on unmount
    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, [timelinePoints, hygienePoints, height]);

  // Sync timeline visual focus with selectedDate
  useEffect(() => {
    if (selectedDate) {
      moveTimelineToDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const bars = barData || defaultBarData;

  // Helper to move timeline to a date and focus the item
  const moveTimelineToDate = (dateStr) => {
    if (timelineRef.current && dateStr) {
      timelineRef.current.moveTo(new Date(dateStr));
      // Find the id (index) of the item with this date
      const idx = timelinePoints.findIndex(p => p.dataObjectLabel === dateStr);
      if (idx !== -1) {
        timelineRef.current.focus(idx, { animation: true });
      }
    }
  };

  // Navigation handlers
  const goToFirst = () => {
    if (timelinePoints && timelinePoints.length > 0) {
      onDateChange(timelinePoints[0].dataObjectLabel);
      moveTimelineToDate(timelinePoints[0].dataObjectLabel);
    }
  };
  const goToPrev = () => {
    if (timelinePoints && timelinePoints.length > 0) {
      const idx = timelinePoints.findIndex(p => p.dataObjectLabel === selectedDate);
      if (idx > 0) {
        onDateChange(timelinePoints[idx - 1].dataObjectLabel);
        moveTimelineToDate(timelinePoints[idx - 1].dataObjectLabel);
      }
    }
  };
  const goToNext = () => {
    if (timelinePoints && timelinePoints.length > 0) {
      const idx = timelinePoints.findIndex(p => p.dataObjectLabel === selectedDate);
      if (idx < timelinePoints.length - 1 && idx !== -1) {
        onDateChange(timelinePoints[idx + 1].dataObjectLabel);
        moveTimelineToDate(timelinePoints[idx + 1].dataObjectLabel);
      }
    }
  };
  const goToLast = () => {
    if (timelinePoints && timelinePoints.length > 0) {
      onDateChange(timelinePoints[timelinePoints.length - 1].dataObjectLabel);
      moveTimelineToDate(timelinePoints[timelinePoints.length - 1].dataObjectLabel);
    }
  };

  // On dropdown change
  const handleDateChange = (e) => {
    onDateChange(e.target.value);
    moveTimelineToDate(e.target.value);
  };

  // Determine if at first or last date
  const isFirst = timelinePoints && timelinePoints.length > 0 && selectedDate === timelinePoints[0].dataObjectLabel;
  const isLast = timelinePoints && timelinePoints.length > 0 && selectedDate === timelinePoints[timelinePoints.length - 1].dataObjectLabel;

  return (
    <div style={{ border: 'none' }}>
      {/* Only show bars and stats details if not minimal */}
      {!minimal && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
          <span style={{ minWidth: 90, textAlign: 'right', color: '#607181', fontWeight: 500 }}>
            {startDate || ''}
          </span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 16, background: '#e9ecef', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${progressPercent || 0}%`, height: '100%', background: '#1da5fe', borderRadius: 8, transition: 'width 0.4s' }} />
            </div>
            <span style={{ minWidth: 40, color: '#1da5fe', fontWeight: 600 }}>{progressPercent || 0}%</span>
          </div>
          <span style={{ minWidth: 110, textAlign: 'left', color: '#607181', fontWeight: 500 }}>
            {endDate || ''}
          </span>
        </div>
      )}
      <div ref={containerRef} style={{ height: `${height || 500}px` }} />
      {/* Date Navigation Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        background: '#f7fafc',
        borderRadius: 8,
        padding: '12px 18px',
        marginTop: 8,
        boxShadow: '0 1px 4px rgba(22, 177, 199, 0.04)'
      }}>
        <button onClick={goToFirst} disabled={isFirst} style={{ background: 'none', border: 'none', cursor: isFirst ? 'not-allowed' : 'pointer', color: isFirst ? '#bfc9d1' : '#1da5fe', fontSize: 18, opacity: isFirst ? 0.5 : 1 }} title="First">
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
        <button onClick={goToPrev} disabled={isFirst} style={{ background: 'none', border: 'none', cursor: isFirst ? 'not-allowed' : 'pointer', color: isFirst ? '#bfc9d1' : '#1da5fe', fontSize: 18, opacity: isFirst ? 0.5 : 1 }} title="Previous">
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {/* Date dropdown */}
        <select
          value={selectedDate}
          onChange={handleDateChange}
          style={{
            border: '1px solid #bfc9d1',
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 15,
            color: '#607181',
            background: '#fff',
            minWidth: 140,
            margin: '0 8px',
            height: 36
          }}
        >
          {timelinePoints.map((point, idx) => (
            <option key={idx} value={point.dataObjectLabel}>
              {point.dataObjectLabel}
            </option>
          ))}
        </select>
        <button onClick={goToNext} disabled={isLast} style={{ background: 'none', border: 'none', color: isLast ? '#bfc9d1' : '#1da5fe', fontSize: 18, opacity: isLast ? 0.5 : 1 }} title="Next">
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={goToLast} disabled={isLast} style={{ background: 'none', border: 'none', color: isLast ? '#bfc9d1' : '#1da5fe', fontSize: 18, opacity: isLast ? 0.5 : 1 }} title="Last">
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
        {/* Compare button moved here, only if not minimal */}
        {!minimal && (
          <button
            onClick={() => {
              setCompare(c => !c);
              if (typeof onCompare === 'function') onCompare();
            }}
            style={{
              marginLeft: 32,
              background: 'none',
              border: 'none',
              color: compare ? '#1da5fe' : '#607181',
              fontWeight: 500,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 4,
              transition: 'color 0.2s',
            }}
          >
            <FontAwesomeIcon icon={faClone} style={{ fontSize: 16 }} />
            Compare
          </button>
        )}
      </div>
    </div>
  );
};

export default VisTimeline;
