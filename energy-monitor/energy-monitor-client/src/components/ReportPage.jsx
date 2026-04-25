import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, AppBar, Toolbar, IconButton, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { rooms, reports } from '../services/api';

function ReportPage() {
  const [roomsList, setRoomsList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const data = await rooms.getAll();
    setRoomsList(data);
  };

  const handleGenerate = async () => {
    try {
      const data = await reports.get(selectedRoom, fromDate, toDate);
      setReportData(data);
    } catch (err) {
      alert('Ошибка формирования отчёта');
    }
  };

  const exportCSV = () => {
    if (!reportData) return;
    let csv = "Точка учёта,Потребление (кВт·ч)\n";
    reportData.details.forEach(detail => {
      csv += `${detail.pointName},${detail.consumption}\n`;
    });
    csv += `\nИТОГО,${reportData.totalConsumption}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${reportData.roomName}_${fromDate}_${toDate}.csv`;
    link.click();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => window.location.href = '/'}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Формирование отчёта</Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 3 }}>
        <TextField
          select
          label="Выберите помещение"
          fullWidth
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          margin="normal"
        >
          {roomsList.map(room => (
            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
          ))}
        </TextField>
        
        <TextField
          label="Дата с"
          type="date"
          fullWidth
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        
        <TextField
          label="Дата по"
          type="date"
          fullWidth
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        
        <Button variant="contained" onClick={handleGenerate} fullWidth sx={{ mt: 2 }}>
          Сформировать
        </Button>
        
        {reportData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Отчёт по помещению: {reportData.roomName}</Typography>
            <Typography variant="h6">Общее потребление: {reportData.totalConsumption} кВт·ч</Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Точка учёта</TableCell>
                    <TableCell align="right">Потребление (кВт·ч)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.details.map((detail, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{detail.pointName}</TableCell>
                      <TableCell align="right">{detail.consumption}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell><strong>ИТОГО</strong></TableCell>
                    <TableCell align="right"><strong>{reportData.totalConsumption}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button variant="outlined" onClick={exportCSV} fullWidth sx={{ mt: 2 }}>
              Сохранить (CSV)
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}

export default ReportPage;