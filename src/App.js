import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { styled } from '@mui/system';

// Stil bileşenleri
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const App = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // API isteği için özelleştirilmiş hook
  const fetchResponse = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/ask', { 
        question: query 
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 saniye timeout
      });
      
      setResponse(res.data.response);
      setHistory(prev => [...prev, {
        question: query,
        response: res.data.response,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      fetchResponse(question);
    }
  };

  // Otomatik olarak yükseklik ayarı
  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <StyledContainer maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🛒 Akıllı Alışveriş Asistanı
        </Typography>
        
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          variant="outlined"
          label="Ne almak istiyorsun?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onInput={adjustTextareaHeight}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !question.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'İşleniyor...' : 'Sor'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Yanıt:
          </Typography>
          <Typography variant="body1" whiteSpace="pre-line">
            {response}
          </Typography>
        </StyledPaper>
      )}

      {history.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Geçmiş Sohbetler
          </Typography>
          {history.slice().reverse().map((item, index) => (
            <StyledPaper key={index} elevation={1} sx={{ mb: 2, p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {new Date(item.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                {item.question}
              </Typography>
              <Typography variant="body2" whiteSpace="pre-line">
                {item.response}
              </Typography>
            </StyledPaper>
          ))}
        </Box>
      )}
    </StyledContainer>
  );
};

export default App;