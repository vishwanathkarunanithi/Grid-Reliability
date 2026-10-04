import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, highlightArea }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 10, 25, 0.8)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass" style={{
        background: '#0b0f19', border: '1px solid #00d2ff',
        padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%',
        boxShadow: '0 0 30px rgba(0, 210, 255, 0.3)',
        animation: 'popIn 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}>
            <AlertTriangle color="#ffc107" size={32} />
          </div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem' }}>{title}</h2>
        </div>
        
        <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', marginBottom: '25px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel}
            style={{
              padding: '10px 20px', background: 'transparent', color: '#ccc',
              border: '1px solid #555', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              if (highlightArea) {
                const el = document.getElementById(highlightArea);
                if (el) {
                  el.style.animation = 'none';
                  setTimeout(() => {
                    el.style.animation = 'highlightPulse 2s ease-out';
                  }, 50);
                }
              }
            }}
            style={{
              padding: '10px 20px', background: '#00d2ff', color: '#000',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 0 15px rgba(0,210,255,0.4)'
            }}
          >
            <Check size={18} /> Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
