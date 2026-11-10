import type { ChangeEvent, FormEvent } from 'react';
import { Box, Button, Dialog, FormLabel, InputBase, Typography } from '@mui/material';
import { PLANS, type Plan } from '@/lib/data';
import { btnSx, fieldSx, selectSx } from '@/lib/ui';

export interface MemberForm {
  n: string;
  p: Plan;
  e: string;
}

interface Props {
  open: boolean;
  editing: boolean;
  form: MemberForm;
  onChange: (f: MemberForm) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const labelSx = {
  display: 'block',
  m: '12px 0 4px',
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: 'normal',
  color: 'inherit',
} as const;

export default function MemberDialog({ open, editing, form, onChange, onClose, onSubmit }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return; // native <dialog> doesn't close on backdrop click
        onClose();
      }}
      transitionDuration={0}
      aria-labelledby="dt"
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(0,0,0,.45)' } },
        paper: {
          sx: {
            bgcolor: 'var(--panel)',
            color: 'var(--ink)',
            backgroundImage: 'none',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            p: '22px',
            m: 0,
            width: 'min(400px,92vw)',
            maxWidth: 'none',
            boxShadow: 'none',
          },
        },
      }}
    >
      <Typography
        component="h2"
        id="dt"
        sx={{
          fontFamily: 'var(--h)',
          fontSize: '1.5em',
          fontWeight: 700,
          lineHeight: 1.5,
          letterSpacing: '-.01em',
          m: 0,
        }}
      >
        {editing ? 'Edit member' : 'Add member'}
      </Typography>

      <Box component="form" id="f" autoComplete="off" onSubmit={submit}>
        <FormLabel htmlFor="fn" sx={labelSx}>
          Full name
        </FormLabel>
        <InputBase
          id="fn"
          required
          autoFocus
          fullWidth
          value={form.n}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...form, n: e.target.value })
          }
          sx={[fieldSx, { display: 'flex' }]}
        />

        <FormLabel htmlFor="fp" sx={labelSx}>
          Plan
        </FormLabel>
        <Box
          component="select"
          id="fp"
          value={form.p}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({ ...form, p: e.target.value as Plan })}
          sx={[selectSx, { width: '100%', display: 'block' }]}
        >
          {PLANS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Box>

        <FormLabel htmlFor="fe" sx={labelSx}>
          Membership ends
        </FormLabel>
        <InputBase
          id="fe"
          type="date"
          required
          fullWidth
          value={form.e}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...form, e: e.target.value })
          }
          sx={[fieldSx, { display: 'flex' }]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', mt: '20px' }}>
          <Button id="cx" type="button" variant="outlined" disableElevation onClick={onClose} sx={btnSx('ghost')}>
            Cancel
          </Button>
          <Button id="sv" type="submit" variant="contained" disableElevation sx={btnSx('primary')}>
            Save member
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
