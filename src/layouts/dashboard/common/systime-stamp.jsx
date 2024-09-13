// src/components/Timestamp.js
import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

// import { primary } from 'src/theme/palette';

const formatDateTime = () => {
  const now = new Date();
  const options = {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return now.toLocaleDateString('en-GB', options).replace(',', '');
};

export default function Timestamp() {
  const [currentTime, setCurrentTime] = useState(formatDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatDateTime());
    }, 1000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography
      variant="body2"
      sx={{ color: '#212B36', fontWeight: 'bold', bgcolor: '#919eab1f', p: 1, borderRadius: 1 }}
    >
      {currentTime}
    </Typography>
  );
}
