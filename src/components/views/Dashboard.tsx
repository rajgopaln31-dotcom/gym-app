import type { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CAP, days, hms, inr, status } from '@/lib/data';
import type { FeedItem, Member, Payment } from '@/lib/data';
import { btnSx, emptySx, h2Sx, panelSx, rowSx } from '@/lib/ui';
import PageHeader from '../PageHeader';

interface Props {
  members: Member[];
  pay: Payment[];
  inside: Set<number>;
  wk: number[];
  feed: FeedItem[];
  onAdd: () => void;
  onRenew: (id: number) => void;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <Box
      sx={{
        p: '16px 18px',
        borderRight: '1px solid var(--line)',
        '&:last-child': { border: '0' },
        '@media (max-width:820px)': {
          '&:nth-child(2)': { borderRight: '0' },
          '&:nth-child(-n+2)': { borderBottom: '1px solid var(--line)' },
        },
      }}
    >
      <Box component="b" sx={{ display: 'block', font: '800 30px/1.1 var(--h)' }}>
        {value}
      </Box>
      <Box component="span" sx={{ color: 'var(--mute)', fontSize: '13px' }}>
        {label}
      </Box>
    </Box>
  );
}

export default function Dashboard({ members, pay, inside, wk, feed, onAdd, onRenew }: Props) {
  const a = members.filter((m) => status(m) === 'active').length;
  const x = members.filter((m) => status(m) === 'expiring').length;
  const due = pay.filter((p) => p.s !== 'paid').reduce((t, p) => t + p.a, 0);
  const chase = members.filter((m) => status(m) !== 'active');
  const maxWk = Math.max(...wk);

  return (
    <>
      <PageHeader
        title="Today at IronYard"
        sub={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        action={
          <Button variant="contained" disableElevation onClick={onAdd} sx={btnSx('primary')}>
            Add member
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 0,
          border: '1px solid var(--line)',
          bgcolor: 'var(--panel)',
          mb: '24px',
          '@media (max-width:820px)': { gridTemplateColumns: '1fr 1fr' },
        }}
      >
        <Stat
          value={
            <>
              {inside.size}
              <Box component="small" sx={{ font: '500 15px var(--b)', color: 'var(--mute)' }}>
                {' / '}
                {CAP}
              </Box>
            </>
          }
          label="In the gym now"
        />
        <Stat value={a} label="Active memberships" />
        <Stat value={x} label="Expiring within 7 days" />
        <Stat value={inr(due)} label="Payments outstanding" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          '@media (max-width:820px)': { gridTemplateColumns: '1fr' },
        }}
      >
        <Box sx={panelSx}>
          <Typography component="h2" sx={h2Sx}>
            Check-ins this week
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              height: '120px',
              mt: '6px',
              mb: '24px',
            }}
          >
            {wk.map((v, i) => (
              <Box
                key={i}
                title={`${v} check-ins`}
                sx={{
                  flex: 1,
                  height: `${(v / maxWk) * 100}%`,
                  bgcolor: 'var(--acc)',
                  opacity: 0.85,
                  borderRadius: '3px 3px 0 0',
                  position: 'relative',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Box
                  component="i"
                  sx={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    font: '12px var(--b)',
                    color: 'var(--mute)',
                    fontStyle: 'normal',
                  }}
                >
                  {DAY_NAMES[i]}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography component="h2" sx={h2Sx}>
            Renewals to chase
          </Typography>
          {chase.length ? (
            chase.map((m) => (
              <Box key={m.id} sx={rowSx}>
                <div>
                  {m.n}
                  <small>
                    {days(m.e) < 0 ? 'Expired ' + -days(m.e) + ' days ago' : 'Ends in ' + days(m.e) + ' days'}
                  </small>
                </div>
                <Button variant="outlined" disableElevation onClick={() => onRenew(m.id)} sx={btnSx('ghost', true)}>
                  Renew
                </Button>
              </Box>
            ))
          ) : (
            <Box sx={emptySx}>Everyone is up to date.</Box>
          )}
        </Box>
      </Box>

      <Box sx={[panelSx, { mt: '24px' }]}>
        <Typography component="h2" sx={h2Sx}>
          Live activity
        </Typography>
        <div id="feed">
          {feed.map((f, i) => (
            <Box key={`${f.t.getTime()}-${i}`} sx={rowSx}>
              <span>{f.x}</span>
              <small>{hms(f.t)}</small>
            </Box>
          ))}
        </div>
      </Box>
    </>
  );
}
