import React from 'react';
import { MdRefresh, MdSwapHoriz, MdDeleteOutline } from 'react-icons/md';
import './ActionButtons.css';

function ActionButtons({ onCopy, onRefresh, onChange, onDelete, loading }) {
  return (
    <div className="action-buttons">
      <button
        className="action-btn refresh-btn"
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh inbox"
      >
        <MdRefresh className="action-icon" />
        <span>Refresh</span>
      </button>

      <button
        className="action-btn change-btn"
        onClick={onChange}
        disabled={loading}
        aria-label="Change email"
      >
        <MdSwapHoriz className="action-icon" />
        <span>New Email</span>
      </button>

      <button
        className="action-btn delete-btn"
        onClick={onDelete}
        disabled={loading}
        aria-label="Delete inbox"
      >
        <MdDeleteOutline className="action-icon" />
        <span>Clear</span>
      </button>
    </div>
  );
}

export default ActionButtons;
