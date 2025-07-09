import React, { useState, useRef } from 'react';
import { Card, CardBody, Button, Badge } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';

const mockScans = Array.from({ length: 8 }, (_, i) => ({
  mainConcern: `Aligner protocol - Stephen Dyos`,
  alignerNumber: i + 1, // Mock aligner number
  dueOn: `2025-05-27 12:1${i} GMT+5`,
  uploadedOn: `2025-05-27 11:5${i} GMT+5`,
}));

const Scans = ({ patient }) => {
  const [sortBy, setSortBy] = useState('dueOn');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedScans = [...mockScans].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // For demo, set current aligner number
  const currentAlignerNumber = 3;
  // For demo: upper = alignerNumber 1-8, lower = 1-8
  const upperScans = sortedScans; // all 8
  const lowerScans = sortedScans; // all 8

  // Scroll handlers for horizontal slider
  const upperGridRef = useRef(null);
  const lowerGridRef = useRef(null);
  const scrollByAmount = 120; // px, matches card width

  const scrollGrid = (ref, dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * scrollByAmount, behavior: 'smooth' });
    }
  };

  // Helper to format date nicely
  function formatDate(dateStr) {
    const date = new Date(dateStr.replace(/ GMT.*/, ''));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div className="scans-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Scans</h4>
        <span className="text-muted small">8 result(s)</span>
      </div>
      <Card className="bg-transparent border-0">
        <CardBody className='pt-1'>
          <h5 className="mb-3">Upper</h5>
          {/* Upper Section with arrows */}
          <div className="scan-cards-slider-wrapper">
            <button className="scan-cards-arrow left" onClick={() => scrollGrid(upperGridRef, -1)} aria-label="Scroll left" type="button">
              <i className="mdi mdi-chevron-left"></i>
            </button>
            <div className="scan-cards-grid" ref={upperGridRef}>
              {upperScans.map((scan, idx) => {
                let cardStateClass = '';
                if (scan.alignerNumber < currentAlignerNumber) cardStateClass = ' scan-card-completed';
                else if (scan.alignerNumber === currentAlignerNumber) cardStateClass = ' scan-card-current';
                else cardStateClass = ' scan-card-notstarted scan-card-disabled';
                const isClickable = scan.alignerNumber <= currentAlignerNumber;
                return (
                  <div key={idx}>
                    <Card
                      className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}`}
                      {...(isClickable
                        ? {
                            onClick: () => navigate(`/patients/${id}/scans/${idx}`),
                            tabIndex: 0,
                            role: 'button',
                            'aria-label': `View scan ${scan.alignerNumber}`,
                          }
                        : { 'aria-disabled': true })}
                    >
                      <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-center p-3">
                        <div className="scan-card-aligner-number">{scan.alignerNumber}</div>
                        <div className="scan-card-date-group">
                          <div className="scan-card-date">{formatDate(scan.dueOn)}</div>
                          <div className="scan-card-date-label">{cardStateClass.includes('scan-card-notstarted') ? 'Start Date' : 'Due Date'}</div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
            <button className="scan-cards-arrow right" onClick={() => scrollGrid(upperGridRef, 1)} aria-label="Scroll right" type="button">
              <i className="mdi mdi-chevron-right"></i>
            </button>
          </div>
          <hr className="my-4" />
          <h5 className="mb-3">Lower</h5>
          {/* Lower Section with arrows */}
          <div className="scan-cards-slider-wrapper">
            <button className="scan-cards-arrow left" onClick={() => scrollGrid(lowerGridRef, -1)} aria-label="Scroll left" type="button">
              <i className="mdi mdi-chevron-left"></i>
            </button>
            <div className="scan-cards-grid" ref={lowerGridRef}>
              {lowerScans.map((scan, idx) => {
                let cardStateClass = '';
                if (scan.alignerNumber < currentAlignerNumber) cardStateClass = ' scan-card-completed';
                else if (scan.alignerNumber === currentAlignerNumber) cardStateClass = ' scan-card-current';
                else cardStateClass = ' scan-card-notstarted scan-card-disabled';
                const isClickable = scan.alignerNumber <= currentAlignerNumber;
                return (
                  <div key={idx}>
                    <Card
                      className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}`}
                      {...(isClickable
                        ? {
                            onClick: () => navigate(`/patients/${id}/scans/${idx}`),
                            tabIndex: 0,
                            role: 'button',
                            'aria-label': `View scan ${scan.alignerNumber}`,
                          }
                        : { 'aria-disabled': true })}
                    >
                      <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-center p-3">
                        <div className="scan-card-aligner-number">{scan.alignerNumber}</div>
                        <div className="scan-card-date-group">
                          <div className="scan-card-date">{formatDate(scan.dueOn)}</div>
                          <div className="scan-card-date-label">{cardStateClass.includes('scan-card-notstarted') ? 'Start Date' : 'Due Date'}</div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
            <button className="scan-cards-arrow right" onClick={() => scrollGrid(lowerGridRef, 1)} aria-label="Scroll right" type="button">
              <i className="mdi mdi-chevron-right"></i>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Scans; 