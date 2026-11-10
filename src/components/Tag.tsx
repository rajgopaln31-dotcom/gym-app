import { Chip } from '@mui/material';
import type { PayStatus, Status } from '@/lib/data';

const colors: Record<Status | PayStatus, string> = {
  active: 'var(--ok)',
  paid: 'var(--ok)',
  expiring: 'var(--warn)',
  due: 'var(--warn)',
  expired: 'var(--bad)',
  overdue: 'var(--bad)',
};

export default function Tag({ kind }: { kind: Status | PayStatus }) {
  return (
    <Chip
      label={kind}
      size="small"
      variant="outlined"
      sx={{
        height: 'auto',
        borderRadius: '99px',
        font: 'inherit',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: 'normal',
        color: colors[kind],
        bgcolor: 'transparent',
        border: '1px solid currentColor',
        verticalAlign: 'baseline',
        '& .MuiChip-label': { p: '2px 9px', lineHeight: 1.5 },
      }}
    />
  );
}
