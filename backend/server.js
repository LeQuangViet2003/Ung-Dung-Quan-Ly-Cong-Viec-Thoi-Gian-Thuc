const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- REST APIs --- //

// GET board data
app.get('/api/board', async (req, res) => {
  try {
    const columns = await prisma.column.findMany({
      include: {
        cards: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    res.json(columns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch board data' });
  }
});

// CREATE Column
app.post('/api/columns', async (req, res) => {
  try {
    const { title } = req.body;
    // Find highest order
    const lastCol = await prisma.column.findFirst({ orderBy: { order: 'desc' } });
    const order = lastCol ? lastCol.order + 1 : 0;
    const newColumn = await prisma.column.create({
      data: { title, order },
      include: { cards: true }
    });
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create column' });
  }
});

// CREATE Card
app.post('/api/cards', async (req, res) => {
  try {
    const { title, description, columnId } = req.body;
    const lastCard = await prisma.card.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    });
    const order = lastCard ? lastCard.order + 1 : 0;
    const newCard = await prisma.card.create({
      data: { title, description, columnId, order }
    });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// UPDATE Column
app.put('/api/columns/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const updatedCol = await prisma.column.update({
      where: { id: req.params.id },
      data: { title }
    });
    res.json(updatedCol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update column' });
  }
});

// DELETE Column
app.delete('/api/columns/:id', async (req, res) => {
  try {
    await prisma.column.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete column' });
  }
});

// UPDATE Card
app.put('/api/cards/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedCard = await prisma.card.update({
      where: { id: req.params.id },
      data: { title, description }
    });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE Card
app.delete('/api/cards/:id', async (req, res) => {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});


// Socket.io for Real-time
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('moveCard', async (data) => {
    // data: { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, cardId }
    try {
      // Optimistic update
      socket.broadcast.emit('cardMoved', data);
      
      const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, cardId } = data;

      if (sourceColumnId === destinationColumnId) {
        // Reordering in the same column
        const cards = await prisma.card.findMany({
          where: { columnId: sourceColumnId },
          orderBy: { order: 'asc' }
        });
        
        const [movedCard] = cards.splice(sourceIndex, 1);
        cards.splice(destinationIndex, 0, movedCard);

        // Update all affected cards
        const updates = cards.map((card, i) => 
          prisma.card.update({ where: { id: card.id }, data: { order: i } })
        );
        await prisma.$transaction(updates);

      } else {
        // Moving to a different column
        const sourceCards = await prisma.card.findMany({
          where: { columnId: sourceColumnId },
          orderBy: { order: 'asc' }
        });
        const destCards = await prisma.card.findMany({
          where: { columnId: destinationColumnId },
          orderBy: { order: 'asc' }
        });

        const [movedCard] = sourceCards.splice(sourceIndex, 1);
        movedCard.columnId = destinationColumnId;
        destCards.splice(destinationIndex, 0, movedCard);

        const sourceUpdates = sourceCards.map((c, i) => 
          prisma.card.update({ where: { id: c.id }, data: { order: i } })
        );
        const destUpdates = destCards.map((c, i) => 
          prisma.card.update({ where: { id: c.id }, data: { order: i, columnId: c.columnId } })
        );

        await prisma.$transaction([...sourceUpdates, ...destUpdates]);
      }
    } catch (error) {
      console.error('Error moving card:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
