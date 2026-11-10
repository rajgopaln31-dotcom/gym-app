'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Box, Fade, Snackbar, SnackbarContent, useMediaQuery } from '@mui/material';
import {
  CAP,
  D,
  INITIAL_INSIDE,
  INITIAL_WEEK,
  PRICE,
  days,
  hms,
  inr,
  initialClasses,
  initialMembers,
  initialPayments,
  status,
} from '@/lib/data';
import type { FeedItem, GymClass, Member, Payment, StatusFilter, View } from '@/lib/data';
import MemberDialog from './MemberDialog';
import type { MemberForm } from './MemberDialog';
import SearchBar from './SearchBar';
import type { Hit } from './SearchBar';
import Sidebar from './Sidebar';
import ClassesView from './views/ClassesView';
import Dashboard from './views/Dashboard';
import MembersView from './views/MembersView';
import PaymentsView from './views/PaymentsView';

export default function GymApp() {
  const [view, setView] = useState<View>('dash');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [classes, setClasses] = useState<GymClass[]>(initialClasses);
  const [pay, setPay] = useState<Payment[]>(initialPayments);
  const [inside, setInside] = useState<Set<number>>(() => new Set(INITIAL_INSIDE));
  const [wk, setWk] = useState<number[]>(INITIAL_WEEK);
  const [live, setLive] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>(() => [{ t: new Date(), x: 'Live feed started' }]);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [resOpen, setResOpen] = useState(false);
  const [clock, setClock] = useState('');
  const [TI] = useState(() => (new Date().getDay() + 6) % 7);

  const [dlgOpen, setDlgOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<MemberForm>({ n: '', p: 'Monthly', e: '' });

  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  /* latest values for the interval callback */
  const snap = useRef({ members, classes, pay, inside, q, live, dlgOpen });
  useEffect(() => {
    snap.current = { members, classes, pay, inside, q, live, dlgOpen };
  });

  const toast = (t: string) => {
    setToastMsg(t);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 2200);
  };

  const log = (x: string) => setFeed((f) => [{ t: new Date(), x }, ...f].slice(0, 8));

  /* ---------- live activity (every 3s) ---------- */
  useEffect(() => {
    const tick = () => {
      const s = snap.current;
      if (!s.live) return;
      const r = Math.random();

      if (r < 0.7) {
        const pool = s.members.filter((m) => status(m) !== 'expired');
        if (!pool.length) return;
        const m = pool[(Math.random() * pool.length) | 0];
        if (s.inside.has(m.id)) {
          setInside((prev) => {
            const n = new Set(prev);
            n.delete(m.id);
            return n;
          });
          const left = 'Left ' + hms(new Date()).slice(0, 5);
          setMembers((ms) => ms.map((x) => (x.id === m.id ? { ...x, in: left } : x)));
          log(m.n + ' checked out');
        } else if (s.inside.size < CAP) {
          setInside((prev) => new Set(prev).add(m.id));
          setMembers((ms) => ms.map((x) => (x.id === m.id ? { ...x, in: 'Just now' } : x)));
          setWk((w) => w.map((v, i) => (i === TI ? v + 1 : v)));
          log(m.n + ' checked in');
        }
        setFlashId(m.id);
        clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlashId(null), 1500);
      } else if (r < 0.85) {
        const open = s.classes.filter((c) => c.b < c.cap);
        if (open.length) {
          const k = open[(Math.random() * open.length) | 0];
          setClasses((cs) => cs.map((c) => (c.id === k.id ? { ...c, b: c.b + 1 } : c)));
          log('New booking: ' + k.n + ' (' + (k.b + 1) + '/' + k.cap + ')');
        }
      } else {
        const due = s.pay.filter((p) => p.s !== 'paid');
        if (due.length) {
          const p = due[(Math.random() * due.length) | 0];
          setPay((ps) => ps.map((x) => (x.id === p.id ? { ...x, s: 'paid' } : x)));
          log(p.m + ' paid ' + inr(p.a));
        }
      }

      const a = document.activeElement;
      if (!(a && a.tagName === 'SELECT') && !s.dlgOpen && s.q.trim()) setResOpen(true);
    };

    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, []);

  /* ---------- clock ---------- */
  useEffect(() => {
    const id = setInterval(() => setClock(hms(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------- keyboard: "/" focuses search, Esc closes results ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName ?? '';
      if (e.key === '/' && !/INPUT|SELECT/.test(tag)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') setResOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- search results ---------- */
  const ql = q.trim().toLowerCase();
  const hits: Hit[] = ql
    ? [
        ...members
          .filter((m) => m.n.toLowerCase().includes(ql))
          .map((m): Hit => ({ go: 'members', kind: 'Member', name: m.n, sub: m.p + ' · ' + status(m) })),
        ...classes
          .filter((c) => (c.n + c.c).toLowerCase().includes(ql))
          .map((c): Hit => ({ go: 'classes', kind: 'Class', name: c.n, sub: c.t })),
        ...pay
          .filter((p) => (p.m + p.s).toLowerCase().includes(ql))
          .map((p): Hit => ({ go: 'pay', kind: 'Payment', name: p.m, sub: inr(p.a) + ' · ' + p.s })),
      ].slice(0, 8)
    : [];

  /* ---------- handlers ---------- */
  const go = (v: View) => {
    setView(v);
    setResOpen(false);
  };

  const onQuery = (v: string) => {
    setQ(v);
    setResOpen(v.trim() !== '');
  };

  const toggleTheme = () => {
    const r = document.documentElement;
    const dark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    const cur = r.dataset.theme || (dark ? 'dark' : 'light');
    r.dataset.theme = cur === 'dark' ? 'light' : 'dark';
  };

  const toggleLive = () => setLive((l) => !l);

  const openDlg = (m?: Member) => {
    setEditId(m ? m.id : null);
    setForm(m ? { n: m.n, p: m.p, e: m.e } : { n: '', p: 'Monthly', e: D(30) });
    setDlgOpen(true);
  };

  const submitDlg = () => {
    setDlgOpen(false);
    const n = form.n.trim();
    const { p, e } = form;
    if (!n) return;
    if (editId !== null) {
      setMembers((ms) => ms.map((m) => (m.id === editId ? { ...m, n, p, e } : m)));
      toast('Changes saved');
    } else {
      const id = Math.max(0, ...members.map((m) => m.id)) + 1;
      setMembers((ms) => [...ms, { id, n, p, e, in: 'Not yet' }]);
      setPay((ps) => [{ id: Date.now(), m: n, a: PRICE[p], d: D(0), s: 'due' }, ...ps]);
      toast(n + ' added');
    }
  };

  const checkIn = (id: number) => {
    const m = members.find((x) => x.id === id);
    if (!m) return;
    setMembers((ms) => ms.map((x) => (x.id === id ? { ...x, in: 'Just now' } : x)));
    toast(m.n + ' checked in');
  };

  const remove = (id: number) => {
    const m = members.find((x) => x.id === id);
    if (!m) return;
    if (window.confirm('Remove ' + m.n + '?')) {
      setMembers((ms) => ms.filter((x) => x.id !== id));
      toast('Member removed');
    }
  };

  const renew = (id: number) => {
    const m = members.find((x) => x.id === id);
    if (!m) return;
    const base = Math.max(0, days(m.e));
    const dd = new Date();
    dd.setDate(dd.getDate() + base + 30);
    const e = dd.toISOString().slice(0, 10);
    setMembers((ms) => ms.map((x) => (x.id === id ? { ...x, e } : x)));
    toast(m.n + '’s membership renewed');
  };

  const book = (id: number) => {
    setClasses((cs) => cs.map((c) => (c.id === id ? { ...c, b: c.b + 1 } : c)));
    toast('Spot booked');
  };

  const markPaid = (id: number) => {
    setPay((ps) => ps.map((p) => (p.id === id ? { ...p, s: 'paid' } : p)));
    toast('Payment marked as paid');
  };

  const onFormSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    submitDlg();
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          minHeight: '100vh',
          '@media (max-width:820px)': { gridTemplateColumns: '1fr', pb: '64px' },
        }}
      >
        <Sidebar view={view} onNav={go} onTheme={toggleTheme} />

        <Box component="main" sx={{ p: '28px clamp(16px,4vw,40px) 48px', maxWidth: '1100px', width: '100%' }}>
          <SearchBar
            q={q}
            open={resOpen && q.trim() !== ''}
            hits={hits}
            live={live}
            clock={clock}
            inputRef={searchRef}
            onQuery={onQuery}
            onGo={go}
            onClose={() => setResOpen(false)}
            onToggleLive={toggleLive}
          />

          <div id="view">
            {view === 'dash' && (
              <Dashboard
                members={members}
                pay={pay}
                inside={inside}
                wk={wk}
                feed={feed}
                onAdd={() => openDlg()}
                onRenew={renew}
              />
            )}
            {view === 'members' && (
              <MembersView
                members={members}
                q={q}
                filter={filter}
                inside={inside}
                flashId={flashId}
                onFilter={setFilter}
                onAdd={() => openDlg()}
                onCheckIn={checkIn}
                onEdit={(id) => openDlg(members.find((m) => m.id === id))}
                onRemove={remove}
              />
            )}
            {view === 'classes' && <ClassesView classes={classes} q={q} onBook={book} />}
            {view === 'pay' && <PaymentsView pay={pay} q={q} onPaid={markPaid} />}
          </div>
        </Box>
      </Box>

      <MemberDialog
        open={dlgOpen}
        editing={editId !== null}
        form={form}
        onChange={setForm}
        onClose={() => setDlgOpen(false)}
        onSubmit={() => onFormSubmit()}
      />

      <Snackbar
        open={toastOn}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
        transitionDuration={reduceMotion ? 0 : 250}
        sx={{ bottom: 'calc(20px + env(safe-area-inset-bottom,0px))', pointerEvents: 'none' }}
      >
        <SnackbarContent
          role="status"
          message={toastMsg}
          sx={{
            bgcolor: 'var(--ink)',
            color: 'var(--bg)',
            p: '10px 18px',
            borderRadius: '6px',
            boxShadow: 'none',
            minWidth: 0,
            flexGrow: 0,
            font: 'inherit',
            '& .MuiSnackbarContent-message': { p: 0 },
          }}
        />
      </Snackbar>
    </>
  );
}
