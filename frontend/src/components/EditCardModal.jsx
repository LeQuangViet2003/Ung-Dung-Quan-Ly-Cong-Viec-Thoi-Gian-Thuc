import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditCardModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  const handleSave = () => {
    onSave(title, description);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel animate-entrance" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa công việc</h2>
          <button className="icon-btn-small" onClick={onClose}><X size={18} /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Tên công việc</label>
            <input 
              type="text" 
              className="input-field" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Ghi chú chi tiết</label>
            <textarea 
              className="input-field textarea-field" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Thêm mô tả chi tiết hơn ở đây..."
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy bỏ</button>
          <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--glass-border);
        }

        .modal-header h2 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          margin: 0;
        }

        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .textarea-field {
          resize: vertical;
          min-height: 100px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid var(--glass-border);
        }
      `}</style>
    </div>
  );
}
