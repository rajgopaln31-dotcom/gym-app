import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { fmt, inr } from '@/lib/data';
import type { Payment } from '@/lib/data';
import { btnSx, tableSx } from '@/lib/ui';
import Highlight from '../Highlight';
import PageHeader from '../PageHeader';
import Tag from '../Tag';

interface Props {
  pay: Payment[];
  q: string;
  onPaid: (id: number) => void;
}

export default function PaymentsView({ pay, q, onPaid }: Props) {
  const ql = q.toLowerCase();
  const collected = pay.filter((p) => p.s === 'paid').reduce((t, p) => t + p.a, 0);
  const outstanding = pay.filter((p) => p.s !== 'paid').reduce((t, p) => t + p.a, 0);
  const list = pay.filter((p) => (p.m + p.s).toLowerCase().includes(ql));

  return (
    <>
      <PageHeader title="Payments" sub={`${inr(collected)} collected · ${inr(outstanding)} outstanding`} />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={tableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Highlight text={p.m} q={q} />
                </TableCell>
                <TableCell>{inr(p.a)}</TableCell>
                <TableCell>{fmt(p.d)}</TableCell>
                <TableCell>
                  <Tag kind={p.s} />
                </TableCell>
                <TableCell>
                  {p.s === 'paid' ? null : (
                    <Button variant="contained" disableElevation onClick={() => onPaid(p.id)} sx={btnSx('primary', true)}>
                      Mark as paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
