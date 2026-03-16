import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { MoreHorizontal, Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function Column({ column, fetchBoard, socket }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleAddCard = async () => {
    const title = prompt('Nhập tên thẻ công việc:');
    if (!title) return;
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, columnId: column.id, description: '' }),
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {});
    }
  };

  const handleEditColumn = async () => {
    setShowMenu(false);
    const title = prompt('Nhập tên mới cho danh sách:', column.title);
    if (!title || title === column.title) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/columns/${column.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {});
    }
  };

  const handleDeleteColumn = async () => {
    setShowMenu(false);
    if (!confirm('Bạn có chắc chắn muốn xóa danh sách này cùng mọi thẻ bên trong?')) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/columns/${column.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {});
    }
  };

  return (
    <div className="column glass-panel">
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn btn-ghost" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className="column-menu glass-panel" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleEditColumn}><Edit2 size={14} /> <span>Đổi tên</span></button>
              <button onClick={handleDeleteColumn} className="text-danger"><Trash2 size={14} /> <span>Xóa danh sách</span></button>
            </div>
          )}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div 
            className={`card-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} fetchBoard={fetchBoard} socket={socket} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className="add-card-btn btn-ghost" onClick={handleAddCard}>
        <Plus size={18} /> Thêm thẻ
      </button>

      <style>{`
        .column {
          min-width: 320px;
          max-width: 320px;
          background: var(--column-bg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          max-height: 100%;
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
        }

        .column-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
        }

        .column-menu {
          position: absolute;
          top: 100%;
          right: 0;
          display: flex;
          flex-direction: column;
          padding: 8px;
          gap: 4px;
          z-index: 50;
          width: 180px;
          background: rgba(30, 41, 59, 0.95);
        }

        .column-menu button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-main);
          padding: 8px 12px;
          text-align: left;
          width: 100%;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-body);
        }

        .column-menu button:hover {
          background: var(--glass-highlight);
        }

        .text-danger {
          color: var(--danger) !important;
        }

        .card-list {
          flex: 1;
          padding: 0 12px 12px;
          min-height: 100px;
          overflow-y: auto;
          transition: background var(--transition-fast);
          border-radius: var(--radius-md);
        }

        .card-list.dragging-over {
          background: rgba(255, 255, 255, 0.05);
        }

        .add-card-btn {
          margin: 0 12px 12px;
          padding: 10px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          justify-content: flex-start;
          transition: all var(--transition-fast);
        }

        .add-card-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
