import React, { useState } from 'react';
import { Container, Button, Typography, Box, TextField, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alerts } from '../services/api';

function Profile() {
  const [pointId, setPointId] = useState('');
  const [limitValue, setLimitValue] = useState('');

  const handleSetLimit = async () => {
    try {
      await alerts.setLimit(parseInt(pointId), parseFloat(limitValue));
      alert('Лимит успешно установлен');
      setPointId('');
      setLimitValue('');
    } catch (err) {
      alert('Ошибка установки лимита');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => window.location.href = '/'}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Профиль пользователя</Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Настройка лимитов оповещений</Typography>
        <TextField
          fullWidth
          label="ID точки учёта"
          type="number"
          value={pointId}
          onChange={(e) => setPointId(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Лимит потребления (кВт·ч/сутки)"
          type="number"
          value={limitValue}
          onChange={(e) => setLimitValue(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleSetLimit} fullWidth sx={{ mt: 2 }}>
          Сохранить лимит
        </Button>
        
        <Button variant="outlined" color="error" onClick={handleLogout} fullWidth sx={{ mt: 4 }}>
          Выйти из системы
        </Button>
      </Container>
    </>
  );
}

export default Profile;