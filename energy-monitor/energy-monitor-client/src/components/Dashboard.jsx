import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, AppBar, Toolbar, Typography, IconButton, Alert, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { rooms, alerts } from '../services/api';

function Dashboard() {
  const [roomsList, setRoomsList] = useState([]);
  const [alertList, setAlertList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  useEffect(() => {
    loadRooms();
    loadAlerts();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await rooms.getAll();
      setRoomsList(data);
    } catch (err) {
      console.error('Ошибка загрузки комнат:', err);
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await alerts.get();
      setAlertList(data);
    } catch (err) {
      console.error('Ошибка загрузки оповещений:', err);
    }
  };

  const handleAddRoom = async () => {
    try {
      await rooms.create({ name: roomName, description: roomDescription });
      setAddModalOpen(false);
      setRoomName('');
      setRoomDescription('');
      loadRooms();
    } catch (err) {
      alert('Ошибка при добавлении комнаты');
    }
  };

  const handleEditRoom = async () => {
    try {
      await rooms.update(selectedRoom.id, { name: roomName, description: roomDescription });
      setEditModalOpen(false);
      setSelectedRoom(null);
      setRoomName('');
      setRoomDescription('');
      loadRooms();
    } catch (err) {
      alert('Ошибка при редактировании');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Удалить помещение?')) {
      try {
        await rooms.delete(id);
        loadRooms();
      } catch (err) {
        alert('Ошибка при удалении');
      }
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setRoomName(room.name);
    setRoomDescription(room.description || '');
    setEditModalOpen(true);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Energy Monitor</Typography>
          <IconButton color="inherit" onClick={() => window.location.href = '/profile'}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 3, mb: 3 }}>
        {alertList.map((alert, idx) => (
          <Alert severity="warning" sx={{ mb: 2 }} key={idx}>{alert.message}</Alert>
        ))}
        
        <Typography variant="h4" sx={{ my: 3 }}>
          Расход сегодня: {roomsList.reduce((sum, room) => sum + (room.todayConsumption || 0), 0)} кВт·ч
        </Typography>
        
        <Grid container spacing={2}>
          {roomsList.map(room => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{room.name}</Typography>
                  <Typography color="text.secondary">{room.description || 'Нет описания'}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Потребление: {room.totalConsumption || 0} кВт·ч</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => window.location.href = `/rooms/${room.id}`}>Открыть</Button>
                  <IconButton size="small" onClick={() => openEditModal(room)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteRoom(room.id)}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Button variant="contained" onClick={() => setAddModalOpen(true)} sx={{ mt: 3 }}>
          + Добавить помещение
        </Button>
        
        <Button variant="outlined" onClick={() => window.location.href = '/report'} sx={{ mt: 2, ml: 2 }}>
          Сформировать отчёт
        </Button>
      </Container>

      {/* Модальное окно добавления */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Добавить помещение</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Название" fullWidth value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <TextField margin="dense" label="Описание" fullWidth value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Отмена</Button>
          <Button onClick={handleAddRoom} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно редактирования */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Редактировать помещение</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Название" fullWidth value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <TextField margin="dense" label="Описание" fullWidth value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Отмена</Button>
          <Button onClick={handleEditRoom} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;