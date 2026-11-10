import type { SxProps, Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

type Sx = SystemStyleObject<Theme>;

const focusRing: Sx = {
  '&:focus-visible, &.Mui-focusVisible': { outline: '2px solid var(--acc)', outlineOffset: '2px' },
};

/* ---------- buttons (.btn, .btn.ghost, .btn.sm) ---------- */
const btnBase: Sx = {
  font: 'inherit',
  fontWeight: 600,
  lineHeight: 1.5,
  letterSpacing: 'normal',
  textTransform: 'none',
  minWidth: 0,
  p: '9px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: 'none',
};
const btnPrimary: Sx = {
  bgcolor: 'var(--acc)',
  color: 'var(--accink)',
  border: '0',
  '&:hover': { bgcolor: 'var(--acc)', boxShadow: 'none' },
};
const btnGhost: Sx = {
  bgcolor: 'transparent',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  '&:hover': { bgcolor: 'transparent', border: '1px solid var(--line)', boxShadow: 'none' },
  '&.Mui-disabled': {
    color: 'var(--ink)',
    border: '1px solid var(--line)',
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
};
const btnSmall: Sx = { p: '5px 10px', fontSize: '13px' };

export const btnSx = (kind: 'primary' | 'ghost', small = false): SxProps<Theme> => [
  btnBase,
  kind === 'primary' ? btnPrimary : btnGhost,
  small && btnSmall,
  focusRing,
];

/* ---------- navigation buttons ---------- */
export const navBtnSx: SxProps<Theme> = [
  {
    font: 'inherit',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: 'normal',
    textTransform: 'none',
    minWidth: 0,
    justifyContent: 'flex-start',
    textAlign: 'left',
    p: '10px 12px',
    borderRadius: '6px',
    color: 'inherit',
    bgcolor: 'transparent',
    opacity: 0.75,
    cursor: 'pointer',
    '&:hover': { opacity: 1, bgcolor: 'transparent' },
    '&[aria-current="true"]': { bgcolor: 'var(--acc)', color: 'var(--accink)', opacity: 1 },
    '@media (max-width:820px)': { p: '8px 10px', fontSize: '13px', textAlign: 'center', justifyContent: 'center' },
  },
  focusRing,
];

/* ---------- panels, rows, headings ---------- */
export const panelSx: Sx = {
  bgcolor: 'var(--panel)',
  border: '1px solid var(--line)',
  p: '18px',
};

export const rowSx: Sx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  p: '10px 0',
  borderTop: '1px solid var(--line)',
  '&:first-of-type': { borderTop: '0' },
  '& small': { color: 'var(--mute)', display: 'block' },
};

export const emptySx: Sx = { p: '28px', textAlign: 'center', color: 'var(--mute)' };

export const h1Sx: Sx = {
  fontFamily: 'var(--h)',
  fontSize: '30px',
  fontWeight: 800,
  lineHeight: 1.5,
  letterSpacing: '-.01em',
  m: 0,
};

export const h2Sx: Sx = {
  fontFamily: 'var(--h)',
  fontSize: '17px',
  fontWeight: 700,
  lineHeight: 1.5,
  letterSpacing: '-.01em',
  m: 0,
  mb: '12px',
};

/* ---------- form fields ---------- */
export const fieldSx: Sx = {
  bgcolor: 'var(--panel)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '6px',
  font: 'inherit',
  '& .MuiInputBase-input': {
    p: '9px 12px',
    height: 'auto',
    boxSizing: 'border-box',
    font: 'inherit',
  },
  '& .MuiInputBase-input:focus-visible': { outline: 'none' },
  '&:focus-within': { outline: '2px solid var(--acc)', outlineOffset: '2px' },
};

export const selectSx: Sx = {
  bgcolor: 'var(--panel)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  p: '9px 12px',
  borderRadius: '6px',
  font: 'inherit',
};

/* ---------- tables (.tbl) ---------- */
export const tableSx: Sx = {
  width: '100%',
  borderCollapse: 'collapse',
  bgcolor: 'var(--panel)',
  border: '1px solid var(--line)',
  '& .MuiTableCell-root': {
    font: 'inherit',
    letterSpacing: 'normal',
    color: 'inherit',
    textAlign: 'left',
    p: '11px 14px',
    border: '0',
    borderTop: '1px solid var(--line)',
  },
  '& .MuiTableCell-head': {
    font: '600 13px var(--b)',
    color: 'var(--mute)',
    p: '10px 14px',
    borderTop: '0',
    borderBottom: '1px solid var(--line)',
  },
};
