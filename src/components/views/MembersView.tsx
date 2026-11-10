import type { ChangeEvent } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { fmt, status } from '@/lib/data';
import type { Member, StatusFilter } from '@/lib/data';
import { btnSx, emptySx, selectSx, tableSx } from '@/lib/ui';
import Highlight from '../Highlight';
import PageHeader from '../PageHeader';
import Tag from '../Tag';

interface Props {
  members: Member[];
  q: string;
  filter: StatusFilter;
  inside: Set<number>;
  flashId: number | null;
  onFilter: (f: StatusFilter) => void;
  onAdd: () => void;
  onCheckIn: (id: number) => void;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
}

const FILTERS: StatusFilter[] = ['all', 'active', 'expiring', 'expired'];

export default function MembersView({
  members,
  q,
  filter,
  inside,
  flashId,
  onFilter,
  onAdd,
  onCheckIn,
  onEdit,
  onRemove,
}: Props) {
  const ql = q.toLowerCase();
  const list = members.filter((m) => m.n.toLowerCase().includes(ql) && (filter === 'all' || status(m) === filter));

  return (
    <>
      <PageHeader
        title="Members"
        sub={`${list.length} of ${members.length} shown`}
        action={
          <Button variant="contained" disableElevation onClick={onAdd} sx={btnSx('primary')}>
            Add member
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: '10px', mb: '14px', flexWrap: 'wrap' }}>
        <Box
          component="select"
          id="flt"
          aria-label="Filter by status"
          value={filter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onFilter(e.target.value as StatusFilter)}
          sx={selectSx}
        >
          {FILTERS.map((v) => (
            <option key={v} value={v}>
              {v === 'all' ? 'All statuses' : v[0].toUpperCase() + v.slice(1)}
            </option>
          ))}
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Ends</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last visit</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((m) => (
              <TableRow key={m.id} className={flashId === m.id ? 'flash' : ''}>
                <TableCell>
                  {inside.has(m.id) ? (
                    <>
                      <span className="dot" title="In the gym now" />{' '}
                    </>
                  ) : null}
                  <Highlight text={m.n} q={q} />
                </TableCell>
                <TableCell>{m.p}</TableCell>
                <TableCell>{fmt(m.e)}</TableCell>
                <TableCell>
                  <Tag kind={status(m)} />
                </TableCell>
                <TableCell>{m.in}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Button variant="outlined" disableElevation onClick={() => onCheckIn(m.id)} sx={btnSx('ghost', true)}>
                    Check in
                  </Button>{' '}
                  <Button variant="outlined" disableElevation onClick={() => onEdit(m.id)} sx={btnSx('ghost', true)}>
                    Edit
                  </Button>{' '}
                  <Button variant="outlined" disableElevation onClick={() => onRemove(m.id)} sx={btnSx('ghost', true)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length ? null : (
          <Box sx={emptySx}>No members match. Clear the search or add a new member.</Box>
        )}
      </Box>
    </>
  );
}
