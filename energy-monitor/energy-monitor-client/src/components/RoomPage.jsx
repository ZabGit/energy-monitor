import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, AppBar, Toolbar, IconButton, List, ListItem, ListItemText, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { rooms, consumptions } from '../services/api';

function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [consumptionModalOpen, setConsumptionModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pointName, setPointName] = useState('');
  const [pointDescription, setPointDescription] = useState('');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [consumptionDate, setConsumptionDate] = useState('');

  useEffect(() => {
    loadPoints();
  }, [id]);

  const loadPoints = async () => {
    try {
      const data = await rooms.getPoints(id);
      setPoints(data);
    } catch (err) {
      console.error('Ошибка загрузки точек:', err);
    }
  };

  const handleAddPoint = async () => {
    try {
      await fetch('http://localhost:5000/api/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          roomId: parseInt(id),
          name: pointName,
          description: pointDescription
        })
      });
      setAddModalOpen(false);
      setPointName('');
      setPointDescription('');
      loadPoints();
    } catch (err) {
      alert('Ошибка добавления точки');
    }
  };

  const handleAddConsumption = async () => {
    try {
      let formattedDate = consumptionDate;
      if (consumptionDate && !consumptionDate.includes('T')) {
        formattedDate = `${consumptionDate}T00:00:00.000Z`;
      } else if (consumptionDate) {
        formattedDate = new Date(consumptionDate).toISOString();
      }
      
      await consumptions.add({
        pointId: selectedPoint.id,
        datetime: formattedDate,
        consumptionValue: parseFloat(consumptionValue)
      });
      setConsumptionModalOpen(false);
      setConsumptionValue('');
      setConsumptionDate('');
      alert('Показание добавлено');
      loadPoints(); 
    } catch (err) {
      console.error('Детали ошибки:', err);
      alert(`Ошибка добавления показания: ${err.message}`);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Помещение #{id}</Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>Точки учёта</Typography>
        <List>
          {points.map(point => (
            <ListItem key={point.id}>
              <ListItemText 
                primary={point.name} 
                secondary={point.description || 'Без описания'} 
              />
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  setSelectedPoint(point);
                  setConsumptionModalOpen(true);
                }}
              >
                Добавить показание
              </Button>
            </ListItem>
          ))}
        </List>
        
        <Button variant="contained" onClick={() => setAddModalOpen(true)} sx={{ mt: 2 }}>
          + Добавить точку учёта
        </Button>
      </Container>

      {/* Модальное окно добавления точки учёта */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Добавить точку учёта</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Название" fullWidth value={pointName} onChange={(e) => setPointName(e.target.value)} />
          <TextField margin="dense" label="Описание" fullWidth value={pointDescription} onChange={(e) => setPointDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Отмена</Button>
          <Button onClick={handleAddPoint} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно добавления показания */}
      <Dialog open={consumptionModalOpen} onClose={() => setConsumptionModalOpen(false)}>
        <DialogTitle>Добавить показание для {selectedPoint?.name}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Дата и время" type="datetime-local" fullWidth value={consumptionDate} onChange={(e) => setConsumptionDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" label="Потребление (кВт·ч)" type="number" fullWidth value={consumptionValue} onChange={(e) => setConsumptionValue(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsumptionModalOpen(false)}>Отмена</Button>
          <Button onClick={handleAddConsumption} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RoomPage;