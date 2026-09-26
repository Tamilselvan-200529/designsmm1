import React, { useState, useRef, useEffect } from 'react';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_CONFIG } from '../../utils/helpers';
import {
  ArrowLeft,
  Globe,
  Target,
  ChevronDown,
  Plus,
  Trash2,
  RefreshCw,
  Settings,
} from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '../common/SocialIcons';

// ── Types ─────────────────────────────────────────────────────────────────────
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
type Day = typeof DAYS[number];

interface TimeSlot {
  id: string;
  hour: number;   // 1–12
  minute: number; // 0–59
  period: 'AM' | 'PM';
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

type WeekSchedule = Record<Day, DaySchedule>;

// ── Default schedule generator ────────────────────────────────────────────────
function makeDefaultSchedule(): WeekSchedule {
  const defaults: Record<Day, TimeSlot[]> = {
    Sunday:    [{ id: 's1', hour: 6, minute: 14, period: 'AM' }, { id: 's2', hour: 10, minute: 28, period: 'PM' }],
    Monday:    [{ id: 'm1', hour: 8, minute: 18, period: 'PM' }, { id: 'm2', hour: 10, minute: 47, period: 'PM' }],
    Tuesday:   [{ id: 't1', hour: 9, minute: 27, period: 'PM' }, { id: 't2', hour: 10, minute: 43, period: 'PM' }],
    Wednesday: [{ id: 'w1', hour: 2, minute: 18, period: 'PM' }, { id: 'w2', hour: 5, minute: 30, period: 'PM' }],
    Thursday:  [{ id: 'th1', hour: 1, minute: 47, period: 'PM' }, { id: 'th2', hour: 3, minute: 19, period: 'PM' }],
    Friday:    [{ id: 'f1', hour: 1, minute: 22, period: 'PM' }, { id: 'f2', hour: 2, minute: 38, period: 'PM' }],
    Saturday:  [{ id: 'sa1', hour: 6, minute: 34, period: 'AM' }, { id: 'sa2', hour: 8, minute: 2, period: 'AM' }],
  };
  const sched: Partial<WeekSchedule> = {};
  for (const day of DAYS) {
    sched[day] = { enabled: true, slots: defaults[day] };
  }
  return sched as WeekSchedule;
}

// ── Timezone list ─────────────────────────────────────────────────────────────
const TIMEZONES = [
  'Kolkata (IST, UTC+5:30)',
  'New York (EST, UTC−5)',
  'London (GMT, UTC+0)',
  'Paris (CET, UTC+1)',
  'Dubai (GST, UTC+4)',
  'Singapore (SGT, UTC+8)',
  'Tokyo (JST, UTC+9)',
  'Sydney (AEST, UTC+10)',
  'Los Angeles (PST, UTC−8)',
  'Chicago (CST, UTC−6)',
  'São Paulo (BRT, UTC−3)',
  'Beijing (CST, UTC+8)',
];

// ── Platform icon ─────────────────────────────────────────────────────────────
function PlatformIcon({ platform, size = 14 }: { platform: SocialPlatform; size?: number }) {
  const color = PLATFORM_CONFIG[platform].brandColor;
  switch (platform) {
    case 'instagram': return <InstagramIcon size={size} color={color} />;
    case 'facebook':  return <FacebookIcon  size={size} color={color} />;
    case 'linkedin':  return <LinkedinIcon  size={size} color={color} />;
    case 'tiktok':    return <TiktokIcon    size={size} color={color} />;
    case 'youtube':   return <YoutubeIcon   size={size} color={color} />;
  }
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    onClick={() => onChange(!on)}
    style={{
      width: '36px', height: '20px', borderRadius: '10px', border: 'none',
      backgroundColor: on ? '#22c55e' : '#e2e8f0',
      position: 'relative', cursor: 'pointer', flexShrink: 0,
      transition: 'background-color 0.2s ease',
    }}
  >
    <span style={{
      position: 'absolute', top: '2px',
      left: on ? '18px' : '2px',
      width: '16px', height: '16px', borderRadius: '50%',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      transition: 'left 0.2s ease',
      display: 'block',
    }} />
  </button>
);

// ── Select / Dropdown ─────────────────────────────────────────────────────────
function SmallSelect<T extends string | number>({
  value, options, onChange, width,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  width?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as unknown as T)}
      style={{
        padding: '5px 8px', borderRadius: '6px',
        border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
        fontSize: '13px', color: '#0f172a', cursor: 'pointer',
        width: width || 'auto',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 6px center',
        paddingRight: '26px',
      }}
    >
      {options.map(opt => (
        <option key={String(opt)} value={String(opt)}>
          {String(opt).padStart(2, '0')}
        </option>
      ))}
    </select>
  );
}

// ── Main ChannelSettingsView ──────────────────────────────────────────────────
interface ChannelSettingsViewProps {
  account: SocialAccount;
  onBack: () => void;
}

export const ChannelSettingsView: React.FC<ChannelSettingsViewProps> = ({ account, onBack }) => {
  const cfg = PLATFORM_CONFIG[account.platform];

  // Per-channel schedule state (keyed by account id)
  const [schedules, setSchedules] = useState<Record<string, WeekSchedule>>({});
  const [timezones, setTimezones] = useState<Record<string, string>>({});
  const [tzOpen, setTzOpen] = useState(false);
  const tzRef = useRef<HTMLDivElement>(null);
  const [genOpen, setGenOpen] = useState(false);
  const genRef = useRef<HTMLDivElement>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Add slot form state
  const [addDay, setAddDay] = useState<'Every Day' | Day>('Every Day');
  const [addHour, setAddHour] = useState(5);
  const [addMinute, setAddMinute] = useState(46);
  const [addPeriod, setAddPeriod] = useState<'AM' | 'PM'>('PM');

  const schedule = schedules[account.id] ?? makeDefaultSchedule();
  const timezone = timezones[account.id] ?? 'Kolkata (IST, UTC+5:30)';

  const setSchedule = (s: WeekSchedule) => setSchedules(p => ({ ...p, [account.id]: s }));
  const setTimezone = (tz: string) => setTimezones(p => ({ ...p, [account.id]: tz }));

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) setTzOpen(false);
      if (genRef.current && !genRef.current.contains(e.target as Node)) setGenOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const toggleDay = (day: Day, enabled: boolean) => {
    setSchedule({ ...schedule, [day]: { ...schedule[day], enabled } });
  };

  const removeSlot = (day: Day, slotId: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: schedule[day].slots.filter(s => s.id !== slotId) },
    });
  };

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      hour: addHour,
      minute: addMinute,
      period: addPeriod,
    };
    const daysToUpdate: Day[] = addDay === 'Every Day' ? [...DAYS] : [addDay as Day];
    const updated = { ...schedule };
    daysToUpdate.forEach(d => {
      updated[d] = { ...updated[d], slots: [...updated[d].slots, { ...newSlot, id: `${newSlot.id}-${d}` }] };
    });
    setSchedule(updated);
  };

  const clearAll = () => {
    const updated = { ...schedule };
    DAYS.forEach(d => { updated[d] = { ...updated[d], slots: [] }; });
    setSchedule(updated);
  };

  const generateSlots = (preset: string) => {
    const presets: Record<string, Partial<Record<Day, TimeSlot[]>>> = {
      'Morning Focus': {
        Monday: [{ id: 'g1', hour: 8, minute: 0, period: 'AM' }],
        Wednesday: [{ id: 'g2', hour: 8, minute: 0, period: 'AM' }],
        Friday: [{ id: 'g3', hour: 8, minute: 0, period: 'AM' }],
      },
      'Peak Hours': {
        Monday: [{ id: 'p1', hour: 12, minute: 0, period: 'PM' }, { id: 'p2', hour: 6, minute: 0, period: 'PM' }],
        Tuesday: [{ id: 'p3', hour: 12, minute: 0, period: 'PM' }],
        Wednesday: [{ id: 'p4', hour: 6, minute: 0, period: 'PM' }],
        Thursday: [{ id: 'p5', hour: 12, minute: 0, period: 'PM' }],
        Friday: [{ id: 'p6', hour: 3, minute: 0, period: 'PM' }],
      },
      'Daily': {
        Sunday: [{ id: 'd0', hour: 9, minute: 0, period: 'AM' }],
        Monday: [{ id: 'd1', hour: 9, minute: 0, period: 'AM' }],
        Tuesday: [{ id: 'd2', hour: 9, minute: 0, period: 'AM' }],
        Wednesday: [{ id: 'd3', hour: 9, minute: 0, period: 'AM' }],
        Thursday: [{ id: 'd4', hour: 9, minute: 0, period: 'AM' }],
        Friday: [{ id: 'd5', hour: 9, minute: 0, period: 'AM' }],
        Saturday: [{ id: 'd6', hour: 9, minute: 0, period: 'AM' }],
      },
    };
    const selected = presets[preset];
    if (!selected) return;
    const updated = { ...makeDefaultSchedule() };
    DAYS.forEach(d => { updated[d].slots = selected[d] ?? []; });
    setSchedule(updated);
    setGenOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const platformLabel = `${cfg.name} ${account.platform === 'linkedin' ? 'Profile' : account.platform === 'youtube' ? 'Channel' : 'Page'}`;

  // Short TZ display
  const tzShort = timezone.split(' ')[0];

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* ── Back + Channel Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '34px', height: '34px', borderRadius: '8px',
              border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
              cursor: 'pointer', color: '#64748b', flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff'; }}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Channel avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={account.avatar}
              alt={account.name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }}
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&size=88&background=f1f5f9&color=64748b`; }}
            />
            <span style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              width: '20px', height: '20px', borderRadius: '50%',
              backgroundColor: cfg.brandColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #ffffff',
            }}>
              <PlatformIcon platform={account.platform} size={11} />
            </span>
          </div>

          {/* Channel name + label */}
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
              {account.name}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.3 }}>{platformLabel}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginTop: '1px', letterSpacing: '0.03em' }}>
              Channel Settings
            </div>
          </div>
        </div>

        {/* Settings icon (top right) */}
        <div style={{
          width: '34px', height: '34px', borderRadius: '8px',
          border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8',
        }}>
          <Settings size={16} />
        </div>
      </div>

      {/* ── Posting Schedule Tab ── */}
      <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '28px' }}>
        <button style={{
          padding: '8px 0', marginRight: '24px', border: 'none', background: 'none',
          fontSize: '14px', fontWeight: 700, color: '#0f172a',
          borderBottom: '2px solid #0f172a', marginBottom: '-2px', cursor: 'pointer',
        }}>
          Posting Schedule
        </button>
      </div>

      {/* ── Time Zone ── */}
      <SettingRow
        label="Time Zone"
        description="Time zone used for scheduling queue for this channel"
      >
        <div style={{ position: 'relative' }} ref={tzRef}>
          <button
            onClick={() => setTzOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 12px', borderRadius: '7px',
              border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
              cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#0f172a',
              whiteSpace: 'nowrap',
            }}
          >
            <Globe size={14} color="#64748b" />
            {tzShort}
            <ChevronDown size={13} color="#94a3b8" style={{ transform: tzOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {tzOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 300,
              backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
              borderRadius: '8px', boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
              minWidth: '260px', maxHeight: '260px', overflowY: 'auto', padding: '4px',
            }}>
              {TIMEZONES.map(tz => (
                <button
                  key={tz}
                  onClick={() => { setTimezone(tz); setTzOpen(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', border: 'none', borderRadius: '6px',
                    backgroundColor: tz === timezone ? 'rgba(37,99,235,0.05)' : 'transparent',
                    cursor: 'pointer', fontSize: '13px', color: '#0f172a',
                    fontWeight: tz === timezone ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (tz !== timezone) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={e => { if (tz !== timezone) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  {tz}
                </button>
              ))}
            </div>
          )}
        </div>
      </SettingRow>

      <Divider />

      {/* ── Posting Goal ── */}
      <SettingRow
        label="Posting Goal"
        description="Choose how often you aim to post on this channel each week."
      >
        <button
          onClick={() => setShowGoalModal(true)}
          style={{
            padding: '7px 14px', borderRadius: '7px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#0f172a',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          Set Posting Goal
        </button>
      </SettingRow>

      {showGoalModal && (
        <PostingGoalModal onClose={() => setShowGoalModal(false)} />
      )}

      <Divider />

      {/* ── Posting Slots ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ maxWidth: '480px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Posting Slots
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Your posting times tells when to send out posts in your Queue. For example,
              the next 5 posts you add to your Queue will be sent in the next 5 upcoming time slots you choose below.
            </div>
          </div>

          {/* Generate New Posting Slots */}
          <div style={{ position: 'relative', flexShrink: 0 }} ref={genRef}>
            <button
              onClick={() => setGenOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '7px 12px', borderRadius: '7px',
                border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#0f172a',
              }}
            >
              <RefreshCw size={13} color="#64748b" />
              Generate New Posting Slots
              <ChevronDown size={13} color="#94a3b8" style={{ transform: genOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {genOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 300,
                backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
                borderRadius: '8px', boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
                minWidth: '200px', padding: '4px',
              }}>
                {['Morning Focus', 'Peak Hours', 'Daily'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => generateSlots(preset)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 12px', border: 'none', borderRadius: '6px',
                      backgroundColor: 'transparent', cursor: 'pointer',
                      fontSize: '13.5px', color: '#0f172a', fontWeight: 500,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seven-day grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
        }}>
          {DAYS.map(day => {
            const ds = schedule[day];
            return (
              <div
                key={day}
                style={{ backgroundColor: '#ffffff', padding: '12px 8px', minHeight: '120px' }}
              >
                {/* Day header */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', textAlign: 'center' }}>
                  {day.substring(0, 3)}
                </div>
                {/* Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>On</span>
                  <Toggle on={ds.enabled} onChange={v => toggleDay(day, v)} />
                </div>

                {/* Time slots */}
                {ds.enabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {ds.slots.map(slot => (
                      <div
                        key={slot.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '3px 6px', borderRadius: '5px',
                          backgroundColor: '#f8fafc', border: '1px solid #f1f5f9',
                          fontSize: '11px', color: '#475569', fontWeight: 600,
                          gap: '4px',
                        }}
                      >
                        <span>
                          {String(slot.hour).padStart(2, '0')} : {String(slot.minute).padStart(2, '0')} {slot.period}
                        </span>
                        <button
                          onClick={() => removeSlot(day, slot.id)}
                          style={{
                            border: 'none', background: 'none', cursor: 'pointer',
                            color: '#94a3b8', padding: '1px', borderRadius: '3px',
                            display: 'flex', alignItems: 'center',
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add Posting Slot ── */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        gap: '8px', padding: '16px 0', borderTop: '1px solid #f1f5f9',
      }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Add a new posting time for
        </span>

        {/* Day picker */}
        <select
          value={addDay}
          onChange={e => setAddDay(e.target.value as typeof addDay)}
          style={{
            padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
            fontSize: '13px', color: '#0f172a', cursor: 'pointer', backgroundColor: '#ffffff',
          }}
        >
          <option>Every Day</option>
          {DAYS.map(d => <option key={d}>{d}</option>)}
        </select>

        <span style={{ fontSize: '13px', color: '#64748b' }}>at</span>

        {/* Hour */}
        <SmallSelect value={addHour} options={hours} onChange={setAddHour} width="60px" />
        <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 700 }}>:</span>
        {/* Minute */}
        <SmallSelect value={addMinute} options={minutes} onChange={setAddMinute} width="60px" />
        {/* AM/PM */}
        <select
          value={addPeriod}
          onChange={e => setAddPeriod(e.target.value as 'AM' | 'PM')}
          style={{
            padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0',
            fontSize: '13px', color: '#0f172a', cursor: 'pointer', backgroundColor: '#ffffff',
          }}
        >
          <option>AM</option>
          <option>PM</option>
        </select>

        {/* Add button */}
        <button
          onClick={addSlot}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 16px', borderRadius: '7px', border: 'none',
            backgroundColor: '#22c55e', color: '#ffffff',
            fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(34,197,94,0.25)',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
        >
          <Plus size={14} />
          Add Posting Slot
        </button>

        {/* Clear All — pushed right */}
        <button
          onClick={clearAll}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '7px',
            border: 'none', backgroundColor: 'transparent',
            color: '#dc2626', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            marginLeft: 'auto',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          .posting-slots-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const SettingRow: React.FC<{
  label: string;
  description: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 0', gap: '16px',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{description}</div>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Divider = () => (
  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
);

// ── Posting Goal Modal ────────────────────────────────────────────────────────
const PostingGoalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [freq, setFreq] = useState(3);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.35)' }} onClick={onClose} />
      <div style={{
        position: 'relative', backgroundColor: '#ffffff', borderRadius: '12px',
        padding: '24px', width: '360px', boxShadow: '0 20px 60px rgba(15,23,42,0.25)',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Set Posting Goal</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.6 }}>
          How many times per week do you aim to post on this channel?
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setFreq(Math.max(1, freq - 1))} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', minWidth: '32px', textAlign: 'center' }}>{freq}</span>
          <button onClick={() => setFreq(Math.min(21, freq + 1))} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          <span style={{ fontSize: '14px', color: '#64748b' }}>times / week</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Cancel</button>
          <button onClick={onClose} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: 'none', backgroundColor: '#22c55e', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff' }}>Save Goal</button>
        </div>
      </div>
    </div>
  );
};
