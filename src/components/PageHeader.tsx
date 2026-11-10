import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { h1Sx } from '@/lib/ui';

interface Props {
  title: string;
  sub: string;
  action?: ReactNode;
}

export default function PageHeader({ title, sub, action }: Props) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '16px',
        flexWrap: 'wrap',
        mb: '22px',
      }}
    >
      <Box>
        <Typography component="h1" sx={h1Sx}>
          {title}
        </Typography>
        <Box component="p" sx={{ m: '2px 0 0', color: 'var(--mute)' }}>
          {sub}
        </Box>
      </Box>
      {action}
    </Box>
  );
}
