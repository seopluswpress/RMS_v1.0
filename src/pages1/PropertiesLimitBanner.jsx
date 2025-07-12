import React from 'react';

import { FiBell } from 'react-icons/fi';

export default function PropertiesLimitBanner({ current, max, onUpgrade, unitCurrent, unitMax, subscriptionDaysLeft }) {
  const propertyExceeded = current > max;
  const unitExceeded = unitCurrent !== undefined && unitMax !== undefined && unitCurrent > unitMax;
  return (
    <div style={{
      background: '#ffe6e6', color: '#b71c1c', padding: '8px 0', borderRadius: 8, margin: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15
    }}>
      {(propertyExceeded || unitExceeded) && (
        <div style={{ color: '#d32f2f', background: '#fff3f3', border: '1px solid #d32f2f', borderRadius: 4, padding: '4px 12px', marginBottom: 6, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
          {(subscriptionDaysLeft !== undefined && subscriptionDaysLeft <= 7 && (propertyExceeded || unitExceeded)) && (
            <FiBell style={{ color: '#ff9800', fontSize: 22 }} title="Your subscription is about to expire and you have reached your plan limit." />
          )}
          <span style={{ marginRight: 8 }}>⚠️</span>
          {propertyExceeded && `You have exceeded your property limit. `}
          {unitExceeded && `You have exceeded your unit limit. `}
          Please upgrade your plan.
        </div>
      )}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '15px',
          padding: '4px 0',
          boxSizing: 'border-box',
        }}
      >
        <marquee
          style={{
            width: '100%',
            fontSize: '1em',
            lineHeight: 1.3,
            padding: '0',
            // Responsive font size for mobile
            ...(window.innerWidth <= 600
              ? { fontSize: '0.95em', padding: '2px 0' }
              : { fontSize: '1.05em', padding: '4px 0' }),
          }}
          behavior="scroll"
          direction="left"
        >
          You have reached your property limit{unitMax !== undefined ? ` and unit limit` : ''}. Upgrade your subscription plan to add more properties and units.
        </marquee>
      </div>
      {onUpgrade && (
        <button style={{ marginLeft: 18, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }} onClick={onUpgrade}>
          Upgrade Plan
        </button>
      )}
    </div>
  );
}

