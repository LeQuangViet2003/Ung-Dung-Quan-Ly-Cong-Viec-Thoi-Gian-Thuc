import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import { Plus } from 'lucide-react';

export default function Board({ socket }) {
  const [columns, setColumns] = useState([]);

  const fetchBoard = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/board');
      const data = await res.json();
      setColumns(data);
    } catch (err) {
      console.error('Failed to load board', err);
    }
  };

  useEffect(() => {
    fetchBoard();

    if (socket) {
      socket.on('cardMoved', (data) => {
        // Simple optimistic sync: refetch board on any broadcasted move.
        // For a perfectly smooth experience, we would manipulate the local state precisely based on data.
        fetchBoard();
      });
    }

    return () => {
      if (socket) socket.off('cardMoved');
    }
  }, [socket]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI update
    const newColumns = Array.from(columns);
    const sourceColIndex = newColumns.findIndex(c => c.id === source.droppableId);
    const destColIndex = newColumns.findIndex(c => c.id === destination.droppableId);

    const sourceCol = newColumns[sourceColIndex];
    const destCol = newColumns[destColIndex];

    const sourceCards = Array.from(sourceCol.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (sourceColIndex === destColIndex) {
      sourceCards.splice(destination.index, 0, movedCard);
      newColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards };
    } else {
      const destCards = Array.from(destCol.cards);
      destCards.splice(destination.index, 0, movedCard);
      newColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards };
      newColumns[destColIndex] = { ...destCol, cards: destCards };
    }

    setColumns(newColumns);

    // Emit event
    if (socket) {
      socket.emit('moveCard', {
        cardId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index
      });
    }
  };

  const handleAddColumn = async () => {
    const title = prompt('Nhập tên danh sách mới:');
    if (!title) return;
    const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      fetchBoard();
      if (socket) socket.emit('moveCard', {}); // trigger sync
    }
  };

  return (
    <div className="board animate-entrance">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map(col => (
          <Column key={col.id} column={col} fetchBoard={fetchBoard} socket={socket} />
        ))}
      </DragDropContext>
      
      <button className="add-column-btn glass-panel btn-ghost" onClick={handleAddColumn}>
        <Plus size={20} />
        <span>Thêm danh sách khác</span>
      </button>

      <style>{`
        .board {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 24px 32px;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .add-column-btn {
          min-width: 280px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px dashed var(--glass-border);
          transition: all var(--transition-normal);
        }

        .add-column-btn:hover {
          background: var(--glass-highlight);
          border-color: var(--accent-primary);
          color: white;
        }
      `}</style>
    </div>
  );
}
