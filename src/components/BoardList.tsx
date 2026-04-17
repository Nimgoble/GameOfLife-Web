import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { listBoards, BoardSummaryResponse } from '../api/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function BoardList() {
  const apiUrl = import.meta.env.GOL_API_URL ?? '';
  const [boards, setBoards] = useState<BoardSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!apiUrl) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const list = await listBoards(apiUrl);
        if (!cancelled) setBoards(list);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/new"
        >
          Create new board
        </Button>
      </Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Existing Boards
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {boards.length === 0 && !loading && <Typography>No boards found.</Typography>}
      <List>
        {boards.map((b) => (
          <ListItem key={b.id} disablePadding>
            <Button
              component={RouterLink}
              to={`/boards/${b.id}`}
              sx={{ justifyContent: 'flex-start', textTransform: 'none', width: '100%' }}
            >
              <ListItemText
                primary={`${b.id} — ${b.rows}x${b.columns}`}
                secondary={new Date(b.createdAt).toLocaleString()}
              />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}