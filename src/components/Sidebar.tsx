import { Box, Button } from '@mui/material';
import type { View } from '@/lib/data';
import { navBtnSx } from '@/lib/ui';

const ITEMS: { v: View; label: string }[] = [
  { v: 'dash', label: 'Dashboard' },
  { v: 'members', label: 'Members' },
  { v: 'classes', label: 'Classes' },
  { v: 'pay', label: 'Payments' },
];

interface Props {
  view: View;
  onNav: (v: View) => void;
  onTheme: () => void;
}

export default function Sidebar({ view, onNav, onTheme }: Props) {
  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        bgcolor: 'var(--ink)',
        color: 'var(--bg)',
        p: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        '@media (max-width:820px)': {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          height: 'auto',
          flexDirection: 'row',
          p: '6px 6px calc(6px + env(safe-area-inset-bottom,0px))',
          zIndex: 5,
          justifyContent: 'space-around',
        },
      }}
    >
      <Box
        sx={{
          font: '800 22px var(--h)',
          p: '0 10px 22px',
          '@media (max-width:820px)': { display: 'none' },
        }}
      >
        IronYard
        <Box component="small" sx={{ display: 'block', font: '500 12px var(--b)', opacity: 0.6 }}>
          Gym manager
        </Box>
      </Box>

      {ITEMS.map((it) => (
        <Button
          key={it.v}
          aria-current={view === it.v ? 'true' : 'false'}
          onClick={() => onNav(it.v)}
          sx={navBtnSx}
        >
          {it.label}
        </Button>
      ))}

      <Box sx={{ flex: 1, '@media (max-width:820px)': { display: 'none' } }} />

      <Button
        id="theme"
        onClick={onTheme}
        sx={{ ...navBtnSx, '@media (max-width:820px)': { display: 'none' } }}
      >
        Switch theme
      </Button>
    </Box>
  );
}
