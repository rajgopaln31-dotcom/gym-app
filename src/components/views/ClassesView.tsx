import { Box, Button, LinearProgress, Typography } from '@mui/material';
import type { GymClass } from '@/lib/data';
import { btnSx, h2Sx, panelSx, rowSx } from '@/lib/ui';
import Highlight from '../Highlight';
import PageHeader from '../PageHeader';

interface Props {
  classes: GymClass[];
  q: string;
  onBook: (id: number) => void;
}

export default function ClassesView({ classes, q, onBook }: Props) {
  const ql = q.toLowerCase();
  const list = classes.filter((c) => (c.n + c.c + c.t).toLowerCase().includes(ql));

  return (
    <>
      <PageHeader title="Classes" sub="Weekly timetable and bookings" />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '16px' }}>
        {list.map((c) => {
          const full = c.b >= c.cap;
          return (
            <Box key={c.id} sx={[panelSx, { display: 'flex', flexDirection: 'column', gap: '6px' }]}>
              <Typography component="h2" sx={h2Sx}>
                <Highlight text={c.n} q={q} />
              </Typography>
              <span>{c.t}</span>
              <Box component="small" sx={{ color: 'var(--mute)' }}>
                {c.c}
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (c.b / c.cap) * 100)}
                sx={{
                  height: '6px',
                  bgcolor: 'var(--line)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  '&::before': { display: 'none' },
                  '& .MuiLinearProgress-bar': { bgcolor: 'var(--acc)', transition: 'none', borderRadius: 0 },
                }}
              />
              <Box sx={[rowSx, { border: '0', p: '4px 0 0' }]}>
                <span>
                  {c.b}/{c.cap} booked
                </span>
                <Button
                  variant={full ? 'outlined' : 'contained'}
                  disableElevation
                  disabled={full}
                  onClick={() => onBook(c.id)}
                  sx={btnSx(full ? 'ghost' : 'primary', true)}
                >
                  {full ? 'Class full' : 'Book a spot'}
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
