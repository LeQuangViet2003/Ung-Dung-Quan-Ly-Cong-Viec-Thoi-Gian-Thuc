import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, MessageSquare, Paperclip, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import EditCardModal from './EditCardModal';

export default function Card({ card, index, fetchBoard, socket }) {
  const [isEditing, setIsEditing] = useState(false);
  const tagColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500'];
  const hasDesc = card.description || Math.random() > 0.5;
  const comments = Math.floor(Math.random() * 5);
  const attachments = Math.floor(Math.random() * 3);
  
  const handleSaveEdit = async (title, description) => {
    setIsEditing(false);
    if (!title) return;
    const res = await fetch(`http://localhost:3001/api/cards/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {});
    }
  };

  const handleDeleteCard = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;
    const res = await fetch(`http://localhost:3001/api/cards/${card.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {});
    }
  };

  return (
    <>
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card glass-panel ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Aesthetic tags */}
          <div className="card-tags">
            {index % 3 === 0 && <span className="tag tag-emerald"></span>}
            {index % 4 === 0 && <span className="tag tag-purple"></span>}
          </div>

          <div className="card-content">
            <p className="card-title">{card.title}</p>
            <div className="card-actions">
              <button className="icon-btn-small" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} title="Sửa thẻ"><Edit2 size={12} /></button>
              <button className="icon-btn-small text-danger" onClick={(e) => { e.stopPropagation(); handleDeleteCard(); }} title="Xóa thẻ"><Trash2 size={12} /></button>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="card-badges">
              {hasDesc && <AlignLeft size={14} className="badge-icon" />}
              {comments > 0 && (
                <span className="badge">
                  <MessageSquare size={14} className="badge-icon" /> {comments}
                </span>
              )}
              {attachments > 0 && (
                <span className="badge">
                  <Paperclip size={14} className="badge-icon" /> {attachments}
                </span>
              )}
            </div>
            <div className="card-avatar"></div>
          </div>

          <style>{`
            .card {
              background: var(--card-bg);
              padding: 16px;
              margin-bottom: 12px;
              border-radius: var(--radius-md);
              box-shadow: var(--shadow-sm);
              border: 1px solid var(--glass-border);
              transition: transform var(--transition-fast), box-shadow var(--transition-fast), outline var(--transition-fast);
              cursor: grab !important;
              position: relative;
            }

            .card:hover {
              background: var(--card-hover);
              transform: translateY(-2px);
              box-shadow: var(--shadow-md);
              border-color: var(--accent-glow);
            }

            .card.is-dragging {
              background: var(--card-hover);
              transform: rotate(-2deg) scale(1.05);
              box-shadow: var(--shadow-lg);
              outline: 2px solid var(--accent-primary);
              z-index: 100;
              opacity: 0.9;
            }

            .card-tags {
              display: flex;
              gap: 6px;
              margin-bottom: 10px;
            }

            .tag {
              height: 6px;
              width: 32px;
              border-radius: var(--radius-sm);
            }
            .tag-emerald { background: var(--success); }
            .tag-purple { background: var(--accent-primary); }

            .card-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 14px;
            }

            .card-title {
              font-size: 0.95rem;
              line-height: 1.4;
              color: var(--text-main);
              font-weight: 500;
              word-break: break-word;
              padding-right: 8px;
            }

            .card-actions {
              display: flex;
              gap: 4px;
              opacity: 0;
              transition: opacity var(--transition-fast);
            }

            .card:hover .card-actions {
              opacity: 1;
            }

            .icon-btn-small {
              background: rgba(255, 255, 255, 0.1);
              border: none;
              color: var(--text-muted);
              width: 24px;
              height: 24px;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }

            .icon-btn-small:hover {
              background: var(--glass-highlight);
              color: var(--text-main);
            }

            .icon-btn-small.text-danger:hover {
              color: var(--danger);
              background: rgba(239, 68, 68, 0.1);
            }

            .card-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .card-badges {
              display: flex;
              gap: 12px;
              color: var(--text-muted);
            }

            .badge {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 0.8rem;
            }

            .badge-icon {
              opacity: 0.8;
            }

            .card-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #10b981, #3b82f6);
            }
          `}</style>
        </div>
      )}
    </Draggable>
    {isEditing && (
      <EditCardModal 
        card={card} 
        onClose={() => setIsEditing(false)} 
        onSave={handleSaveEdit} 
      />
    )}
    </>
  );
}
