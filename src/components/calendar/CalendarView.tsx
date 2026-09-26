import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarFilters } from './CalendarFilters';
import type { CalendarFilterState } from './CalendarFilters';
import { RescheduleModal } from './RescheduleModal';
import { Button } from '../common/Button';
import { PlatformBadge, StatusBadge } from '../common/Badge';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '../common/SocialIcons';
import type { Post, SocialPlatform } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  Copy,
  PenSquare,
  CalendarDays,
  List,
  LayoutGrid,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

interface CalendarDayCell {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string; // YYYY-MM-DD
  month: number;
  year: number;
}

const buildCalendarGrid = (year: number, month: number): CalendarDayCell[] => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: CalendarDayCell[] = [];

  // Leading days from prev month
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ dayNumber: d, isCurrentMonth: false, isToday: dateKey === todayStr, dateKey, month: prevMonth, year: prevYear });
  }

  // Current month
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ dayNumber: d, isCurrentMonth: true, isToday: dateKey === todayStr, dateKey, month, year });
  }

  // Trailing days for next month
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;
  const remaining = 42 - cells.length; // always 6 rows
  for (let d = 1; d <= remaining; d++) {
    const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ dayNumber: d, isCurrentMonth: false, isToday: dateKey === todayStr, dateKey, month: nextMonth, year: nextYear });
  }

  return cells;
};

// ─── Contextual Popover for date click ────────────────────────────────────────
interface DatePopoverProps {
  dateLabel: string;
  position: { x: number; y: number };
  onCreatePost: () => void;
  onClose: () => void;
}

const DatePopover: React.FC<DatePopoverProps> = ({
  dateLabel,
  position,
  onCreatePost,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to avoid edge overflow
  const style: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 200),
    top: Math.min(position.y, window.innerHeight - 120),
    zIndex: 1200,
  };

  return (
    <div className="cal-date-popover" style={style} ref={ref}>
      <div className="cal-date-popover-header">{dateLabel}</div>
      <button
        className="cal-date-popover-option"
        onClick={() => {
          onCreatePost();
          onClose();
        }}
        type="button"
      >
        <Plus size={14} />
        <span>Create a Post</span>
      </button>
    </div>
  );
};

// ─── Platform icon renderer ───────────────────────────────────────────────────
const renderPlatformSmallIcon = (p: SocialPlatform) => {
  switch (p) {
    case 'instagram': return <InstagramIcon size={11} color="#e1306c" />;
    case 'facebook':  return <FacebookIcon  size={11} color="#1877f2" />;
    case 'linkedin':  return <LinkedinIcon  size={11} color="#0a66c2" />;
    case 'tiktok':    return <TiktokIcon    size={11} color="#000000" />;
    case 'youtube':   return <YoutubeIcon   size={11} color="#ff0000" />;
    default: return null;
  }
};

// ─── Post card inside month grid ─────────────────────────────────────────────
interface CalPostCardProps {
  post: Post;
  onDragStart: (e: React.DragEvent) => void;
  onClick: () => void;
}

const CalPostCard: React.FC<CalPostCardProps> = ({ post, onDragStart, onClick }) => (
  <div
    className="cal-post-card"
    draggable
    onDragStart={onDragStart}
    onClick={onClick}
    title={`${post.content} — Click to inspect, drag to reschedule`}
  >
    <div className={`cal-status-stripe cal-status-${post.status}`} />
    {post.mediaUrls[0] && (
      <img src={post.mediaUrls[0]} alt="Post thumbnail" className="cal-post-thumb" />
    )}
    <div className="cal-post-meta">
      <div className="cal-post-platforms">
        {post.platforms.map(p => (
          <span key={p}>{renderPlatformSmallIcon(p)}</span>
        ))}
        <span className="cal-post-time">
          {post.scheduledTime?.split('at')[1]?.trim() || post.publishedTime?.split('at')[1]?.trim() || '—'}
        </span>
      </div>
      <span className="cal-post-title">{post.content}</span>
    </div>
  </div>
);

// ─── CalendarView ─────────────────────────────────────────────────────────────
export const CalendarView: React.FC = () => {
  const {
    posts,
    brandMembers,
    openComposer,
    openReviewDrawer,
    reschedulePost,
    deletePost,
    duplicatePost,
  } = useApp();

  // ── Calendar navigation state ──
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');

  // ── Date click popover ──
  const [popover, setPopover] = useState<{
    dateKey: string;
    dateLabel: string;
    position: { x: number; y: number };
  } | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // ── Reschedule modal ──
  const [reschedulingPost, setReschedulingPost] = useState<Post | null>(null);

  // ── Filters ──
  const [filters, setFilters] = useState<CalendarFilterState>({
    types: [],
    postTypes: [],
    networkTypes: [],
    createdBy: [],
  });

  // ── Calendar grid ──
  const calendarDays = buildCalendarGrid(viewYear, viewMonth);

  // ── Navigation ──
  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // ── Filter posts ──
  const filteredPosts = posts.filter(post => {
    // "Type" filter: 'post' = any non-video/story/reel; others match mediaType
    if (filters.types.length > 0) {
      const mt = post.mediaType || 'image';
      const matchesType = filters.types.some(t => {
        if (t === 'video') return mt === 'video';
        if (t === 'reel')  return mt === 'video'; // reels are video
        if (t === 'story') return mt === 'image' && post.platforms.some(p => p === 'instagram');
        if (t === 'post')  return true; // 'post' matches all
        return false;
      });
      if (!matchesType) return false;
    }
    if (filters.postTypes.length > 0 && !filters.postTypes.includes(post.status)) return false;
    if (filters.networkTypes.length > 0 && !post.platforms.some(p => filters.networkTypes.includes(p))) return false;
    if (filters.createdBy.length > 0 && !filters.createdBy.includes(post.author.id)) return false;
    return true;
  });

  // ── Get posts for a specific dateKey ──
  const getPostsForDateKey = useCallback((dateKey: string): Post[] => {
    return filteredPosts.filter(post => {
      const timeStr = post.scheduledTime || post.publishedTime || '';
      // Map post to date: look for YYYY-MM-DD or "Sep 20" style in scheduledTime
      // We do a best-effort match against our mock data dateKey
      if (!timeStr) return false;
      // If the timeStr starts with the dateKey (ISO format)
      if (timeStr.startsWith(dateKey)) return true;
      // Legacy mock data: parse "Sep 20 at ..." style
      const monthDay = timeStr.match(/([A-Za-z]+)\s+(\d{1,2})/);
      if (monthDay) {
        const mon = MONTHS.findIndex(m => m.startsWith(monthDay[1]));
        if (mon !== -1) {
          const mKey = `${viewYear}-${String(mon + 1).padStart(2, '0')}-${String(parseInt(monthDay[2])).padStart(2, '0')}`;
          return mKey === dateKey;
        }
      }
      return false;
    });
  }, [filteredPosts, viewYear]);

  // Fallback: distribute demo posts across Sep 2026 dates for the mock
  const getDemoPosts = useCallback((dateKey: string): Post[] => {
    const demoDayMap: Record<string, string[]> = {
      '2026-09-20': ['post-5'],
      '2026-09-21': ['post-2'],
      '2026-09-22': ['post-4'],
      '2026-09-23': ['post-6', 'post-3'],
      '2026-09-24': ['post-1'],
      '2026-09-27': ['post-7'],
    };
    const ids = demoDayMap[dateKey] || [];
    return filteredPosts.filter(p => ids.includes(p.id));
  }, [filteredPosts]);

  const getPostsForDay = useCallback((dateKey: string): Post[] => {
    const fromSchedule = getPostsForDateKey(dateKey);
    if (fromSchedule.length > 0) return fromSchedule;
    return getDemoPosts(dateKey);
  }, [getPostsForDateKey, getDemoPosts]);

  // ── Drag and drop ──
  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.setData('text/plain', post.id);
  };

  const handleDropOnDay = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      const [year, month, day] = dateKey.split('-').map(Number);
      const label = `${MONTHS[month - 1]} ${day}, ${year}`;
      reschedulePost(postId, `${label} at 12:00 PM`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // ── Date cell click → show popover ──
  const handleDateCellClick = (e: React.MouseEvent, cell: CalendarDayCell) => {
    // Only show if click target is the cell itself (not a post card)
    const target = e.target as HTMLElement;
    if (target.closest('.cal-post-card')) return;
    if (target.closest('.calendar-add-post-btn')) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const d = `${MONTHS[cell.month]} ${cell.dayNumber}, ${cell.year}`;
    setPopover({
      dateKey: cell.dateKey,
      dateLabel: d,
      position: { x: rect.left + 4, y: rect.bottom + 4 },
    });
    setSelectedDateKey(cell.dateKey);
  };

  const handleCreatePostForDate = () => {
    // Open composer — in a full impl, pass the selected date
    openComposer();
  };

  // ── Formatted month title ──
  const monthTitle = `${MONTHS[viewMonth]} ${viewYear}`;

  // ── Week view: compute current week from today or a day in the current month ──
  const weekStart = (() => {
    const d = new Date(viewYear, viewMonth, 1);
    d.setDate(d.getDate() - d.getDay()); // go to Sunday of that week
    return d;
  })();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    return {
      label: `${WEEKDAYS[d.getDay()]} ${d.getDate()}`,
      dateKey,
      isToday,
      dayNum: d.getDate(),
    };
  });

  // ── Day view: today ──
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayPosts = getPostsForDay(todayKey);
  const todayLabel = `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <div className="cal-page">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '22px' }}>
            Content Calendar
          </h1>
          <p className="text-body">
            Plan, schedule and manage your social posts across all platforms
          </p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => openComposer()}
            id="calendar-create-post-btn"
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* ── Calendar Card ───────────────────────────────────────────────── */}
      <div className="calendar-container">

        {/* ── Header Row ─────────────────────────────────────────────── */}
        <div className="calendar-header">
          {/* Left: Nav + Month Title + Today */}
          <div className="cal-header-left">
            <button
              className="cal-nav-btn"
              onClick={goToPrevMonth}
              aria-label="Previous month"
              id="calendar-prev-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="cal-nav-btn"
              onClick={goToNextMonth}
              aria-label="Next month"
              id="calendar-next-btn"
            >
              <ChevronRight size={16} />
            </button>
            <h2 className="calendar-month-title">{monthTitle}</h2>
            <button
              className="cal-today-btn"
              onClick={goToToday}
              id="calendar-today-btn"
            >
              Today
            </button>
          </div>

          {/* Right: View Toggle */}
          <div className="calendar-view-toggle">
            {(
              [
                { mode: 'month' as const, label: 'Month', icon: <LayoutGrid size={13} /> },
                { mode: 'week'  as const, label: 'Week',  icon: <CalendarDays size={13} /> },
                { mode: 'day'   as const, label: 'Day',   icon: <Clock size={13} /> },
                { mode: 'list'  as const, label: 'List',  icon: <List size={13} /> },
              ] as const
            ).map(({ mode, label, icon }) => (
              <button
                key={mode}
                className={`calendar-view-btn ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}
                id={`calendar-view-${mode}-btn`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter Bar ─────────────────────────────────────────────── */}
        <CalendarFilters
          filters={filters}
          onChange={setFilters}
          brandMembers={brandMembers}
        />

        {/* ── MONTH VIEW ─────────────────────────────────────────────── */}
        {viewMode === 'month' && (
          <div className="cal-month-view">
            {/* Weekday labels */}
            <div className="calendar-grid-header">
              {WEEKDAYS.map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            {/* Day cells grid */}
            <div className="calendar-grid">
              {calendarDays.map((cell, index) => {
                const dayPosts = getPostsForDay(cell.dateKey);
                const isSelected = selectedDateKey === cell.dateKey;

                return (
                  <div
                    key={index}
                    className={[
                      'calendar-day-cell',
                      !cell.isCurrentMonth ? 'other-month' : '',
                      cell.isToday ? 'today' : '',
                      isSelected ? 'selected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={e => cell.isCurrentMonth && handleDateCellClick(e, cell)}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDropOnDay(e, cell.dateKey)}
                    role="button"
                    tabIndex={cell.isCurrentMonth ? 0 : -1}
                    aria-label={`${cell.dayNumber} ${MONTHS[cell.month]}`}
                  >
                    <div className="calendar-day-header">
                      <span className="calendar-day-num">{cell.dayNumber}</span>
                      {cell.isCurrentMonth && (
                        <button
                          className="calendar-add-post-btn"
                          title={`Create post for ${MONTHS[cell.month]} ${cell.dayNumber}`}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedDateKey(cell.dateKey);
                            openComposer();
                          }}
                          aria-label={`Add post for ${cell.dayNumber}`}
                        >
                          <Plus size={11} />
                        </button>
                      )}
                    </div>

                    <div className="cal-day-posts">
                      {dayPosts.map(post => (
                        <CalPostCard
                          key={post.id}
                          post={post}
                          onDragStart={e => handleDragStart(e, post)}
                          onClick={() => openReviewDrawer(post)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WEEK VIEW ──────────────────────────────────────────────── */}
        {viewMode === 'week' && (
          <div className="cal-week-view">
            {weekDays.map(col => {
              const dayPosts = getPostsForDay(col.dateKey);
              return (
                <div
                  key={col.dateKey}
                  className={`cal-week-col ${col.isToday ? 'today' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDropOnDay(e, col.dateKey)}
                >
                  <div className={`cal-week-col-header ${col.isToday ? 'today' : ''}`}>
                    <span className="cal-week-day-name">
                      {col.label.split(' ')[0]}
                    </span>
                    <span className={`cal-week-day-num ${col.isToday ? 'today' : ''}`}>
                      {col.label.split(' ')[1]}
                    </span>
                  </div>
                  <div className="cal-week-col-body">
                    {dayPosts.length === 0 ? (
                      <button
                        className="cal-week-empty"
                        onClick={() => {
                          setSelectedDateKey(col.dateKey);
                          openComposer();
                        }}
                      >
                        <Plus size={12} />
                        <span>Add post</span>
                      </button>
                    ) : (
                      dayPosts.map(post => (
                        <div
                          key={post.id}
                          className="cal-week-post-card"
                          draggable
                          onDragStart={e => handleDragStart(e, post)}
                          onClick={() => openReviewDrawer(post)}
                        >
                          <div className={`cal-status-stripe cal-status-${post.status}`} />
                          {post.mediaUrls[0] && (
                            <img
                              src={post.mediaUrls[0]}
                              alt="Thumb"
                              className="cal-post-thumb"
                              style={{ width: 26, height: 26 }}
                            />
                          )}
                          <div className="cal-post-meta">
                            <div className="cal-post-platforms">
                              {post.platforms.map(p => (
                                <span key={p}>{renderPlatformSmallIcon(p)}</span>
                              ))}
                              <span className="cal-post-time">
                                {post.scheduledTime?.split('at')[1]?.trim() || '—'}
                              </span>
                            </div>
                            <p className="cal-post-title" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {post.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── DAY VIEW ───────────────────────────────────────────────── */}
        {viewMode === 'day' && (
          <div className="cal-day-view">
            <div className="cal-day-view-header">
              <div>
                <span className="cal-day-view-title">{todayLabel}</span>
                <span className="cal-day-view-subtitle">
                  {todayPosts.length === 0
                    ? 'No posts scheduled today'
                    : `${todayPosts.length} post${todayPosts.length > 1 ? 's' : ''} scheduled`}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={13} />}
                onClick={() => openComposer()}
                id="day-view-create-btn"
              >
                Create Post
              </Button>
            </div>

            <div className="cal-day-posts-list">
              {todayPosts.length === 0 ? (
                <div className="cal-day-empty">
                  <CalendarDays size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                  <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                    No posts scheduled for today.
                  </p>
                  <button
                    className="cal-create-post-link"
                    onClick={() => openComposer()}
                  >
                    + Create a post for today
                  </button>
                </div>
              ) : (
                todayPosts.map(post => (
                  <div
                    key={post.id}
                    className="cal-day-post-row"
                    onClick={() => openReviewDrawer(post)}
                  >
                    <div className={`cal-status-stripe cal-status-${post.status}`} style={{ position: 'static', width: 3, height: '100%', borderRadius: 2, alignSelf: 'stretch', flexShrink: 0 }} />
                    {post.mediaUrls[0] && (
                      <img
                        src={post.mediaUrls[0]}
                        alt="Thumbnail"
                        style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div className="cal-day-post-info">
                      <div className="cal-day-post-platforms">
                        {post.platforms.map(p => (
                          <PlatformBadge key={p} platform={p} showName={false} />
                        ))}
                        <span className="cal-day-post-time">
                          {post.scheduledTime || post.publishedTime || 'Draft'}
                        </span>
                      </div>
                      <span className="cal-day-post-content">{post.content}</span>
                      <span className="cal-day-post-author">by {post.author.name}</span>
                    </div>
                    <div className="cal-day-post-actions" onClick={e => e.stopPropagation()}>
                      <StatusBadge status={post.status} />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setReschedulingPost(post)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────────── */}
        {viewMode === 'list' && (
          <div className="calendar-list-view">
            {filteredPosts.length === 0 ? (
              <div className="cal-day-empty">
                <List size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                  No posts match the current filters.
                </p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="calendar-list-row"
                  onClick={() => openReviewDrawer(post)}
                >
                  <div className="cal-list-left">
                    {post.mediaUrls[0] && (
                      <img
                        src={post.mediaUrls[0]}
                        alt="Thumb"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 'var(--radius-md)',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div className="cal-list-info">
                      <span className="cal-list-content">{post.content}</span>
                      <div className="cal-list-meta">
                        <div className="flex gap-1">
                          {post.platforms.map(p => (
                            <PlatformBadge key={p} platform={p} showName={false} />
                          ))}
                        </div>
                        <span className="text-caption">by {post.author.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="cal-list-right" onClick={e => e.stopPropagation()}>
                    <span className="cal-list-time">
                      {post.scheduledTime || post.publishedTime || 'Draft'}
                    </span>
                    <StatusBadge status={post.status} />
                    <div className="cal-list-actions">
                      <button
                        className="btn btn-ghost btn-icon-only btn-sm"
                        title="Reschedule"
                        onClick={() => setReschedulingPost(post)}
                      >
                        <Clock size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon-only btn-sm"
                        title="Duplicate"
                        onClick={() => duplicatePost(post.id)}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon-only btn-sm"
                        title="Delete"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Date Click Popover ─────────────────────────────────────────── */}
      {popover && (
        <DatePopover
          dateLabel={popover.dateLabel}
          position={popover.position}
          onCreatePost={handleCreatePostForDate}
          onClose={() => {
            setPopover(null);
            setSelectedDateKey(null);
          }}
        />
      )}

      {/* ── Reschedule Modal ───────────────────────────────────────────── */}
      <RescheduleModal
        post={reschedulingPost}
        isOpen={Boolean(reschedulingPost)}
        onClose={() => setReschedulingPost(null)}
        onReschedule={reschedulePost}
      />
    </div>
  );
};
