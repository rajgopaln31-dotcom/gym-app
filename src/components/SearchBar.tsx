import type { ChangeEvent, RefObject } from 'react';
import { Box, Button, ButtonBase, ClickAwayListener, InputBase, Paper } from '@mui/material';
import type { View } from '@/lib/data';
import { btnSx, emptySx, fieldSx } from '@/lib/ui';
import Highlight from './Highlight';

export interface Hit {
  go: View;
  kind: string;
  name: string;
  sub: string;
}

interface Props {
  q: string;
  open: boolean;
  hits: Hit[];
  live: boolean;
  clock: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onQuery: (v: string) => void;
  onGo: (v: View) => void;
  onClose: () => void;
  onToggleLive: () => void;
}

export default function SearchBar({
  q,
  open,
  hits,
  live,
  clock,
  inputRef,
  onQuery,
  onGo,
  onClose,
  onToggleLive,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '14px',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: '22px',
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '520px' }}>
          <InputBase
            id="gq"
            type="search"
            fullWidth
            autoComplete="off"
            placeholder="Search members, classes, payments (press /)"
            inputRef={inputRef}
            value={q}
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onQuery(e.target.value)}
            inputProps={{ 'aria-label': 'Search everything' }}
            sx={[fieldSx, { '& .MuiInputBase-input': { p: '11px 14px' } }]}
          />
          {open && (
            <Paper
              id="res"
              elevation={0}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: '4px',
                bgcolor: 'var(--panel)',
                color: 'var(--ink)',
                backgroundImage: 'none',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,.18)',
                zIndex: 6,
                overflow: 'hidden',
              }}
            >
              {hits.length ? (
                hits.map((h, i) => (
                  <ButtonBase
                    key={i}
                    onClick={() => onGo(h.go)}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      font: 'inherit',
                      color: 'inherit',
                      p: '9px 14px',
                      cursor: 'pointer',
                      borderTop: i === 0 ? '0' : '1px solid var(--line)',
                      '&:hover, &:focus-visible': { bgcolor: 'var(--bg)' },
                      '& small': { display: 'block', color: 'var(--mute)' },
                    }}
                  >
                    <b>
                      <Highlight text={h.name} q={q} />
                    </b>
                    <small>
                      {h.kind} · {h.sub}
                    </small>
                  </ButtonBase>
                ))
              ) : (
                <Box sx={emptySx}>Nothing found for “{q}”.</Box>
              )}
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
        <span className={live ? 'dot' : 'dot off'} id="dot" />
        <span id="lv">{live ? 'Live' : 'Paused'}</span>
        <Box component="span" id="clk" sx={{ fontVariantNumeric: 'tabular-nums', color: 'var(--mute)' }}>
          {clock}
        </Box>
        <Button id="pz" variant="outlined" disableElevation onClick={onToggleLive} sx={btnSx('ghost', true)}>
          {live ? 'Pause' : 'Resume'}
        </Button>
      </Box>
    </Box>
  );
}
