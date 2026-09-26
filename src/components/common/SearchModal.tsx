import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, FileText, Users, Share2, ArrowRight } from 'lucide-react';
import { PlatformBadge, StatusBadge } from './Badge';
import '../../styles/search.css';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    posts, 
    mediaItems, 
    teamMembers, 
    socialAccounts,
    setActiveNav,
    openReviewDrawer
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingPosts = trimmed ? posts.filter(p => 
    p.content.toLowerCase().includes(trimmed) || 
    p.author.name.toLowerCase().includes(trimmed)
  ) : [];

  const matchingMedia = trimmed ? mediaItems.filter(m => 
    m.name.toLowerCase().includes(trimmed) || 
    m.tags.some(t => t.toLowerCase().includes(trimmed))
  ) : [];

  const matchingTeam = trimmed ? teamMembers.filter(t => 
    t.name.toLowerCase().includes(trimmed) || 
    t.email.toLowerCase().includes(trimmed) ||
    t.role.toLowerCase().includes(trimmed)
  ) : [];

  const matchingAccounts = trimmed ? socialAccounts.filter(a => 
    a.name.toLowerCase().includes(trimmed) || 
    a.username.toLowerCase().includes(trimmed)
  ) : [];

  const handleSelectPost = (post: typeof posts[0]) => {
    setIsSearchOpen(false);
    setActiveNav('content');
    openReviewDrawer(post);
  };

  const handleSelectMedia = () => {
    setIsSearchOpen(false);
    setActiveNav('media');
  };

  const handleSelectTeam = () => {
    setIsSearchOpen(false);
    setActiveNav('team');
  };

  const handleSelectAccount = () => {
    setIsSearchOpen(false);
    setActiveNav('social');
  };

  return (
    <>
      <div className="search-overlay" onClick={() => setIsSearchOpen(false)} />
      
      <div className="search-dropdown-container">
        <div className="search-dropdown-inner">
          <div className="search-box-large">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for product overviews, FAQs, and more..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-box-input"
            />
            <div className="search-box-icon">
              <Search size={20} />
            </div>
          </div>

          {trimmed && (
            <div className="search-results-panel">
              {matchingPosts.length === 0 && matchingMedia.length === 0 && matchingTeam.length === 0 && matchingAccounts.length === 0 ? (
                <div className="py-8 text-center text-muted">
                  <p>No results found for "{query}".</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '420px', paddingRight: '4px' }}>
                  {matchingPosts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-metadata">POSTS ({matchingPosts.length})</span>
                      {matchingPosts.map(post => (
                        <div
                          key={post.id}
                          className="search-result-item"
                          onClick={() => handleSelectPost(post)}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText size={16} color="var(--color-primary)" />
                            <span className="text-body search-result-text">
                              {post.content}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusBadge status={post.status} showIcon={false} />
                            <ArrowRight size={14} color="var(--text-muted)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingMedia.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-metadata">MEDIA ASSETS ({matchingMedia.length})</span>
                      {matchingMedia.map(media => (
                        <div
                          key={media.id}
                          className="search-result-item"
                          onClick={handleSelectMedia}
                        >
                          <div className="flex items-center gap-3">
                            <img src={media.url} alt={media.name} style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span className="text-body font-medium">{media.name}</span>
                          </div>
                          <span className="text-caption">{media.folder}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingTeam.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-metadata">TEAM MEMBERS ({matchingTeam.length})</span>
                      {matchingTeam.map(member => (
                        <div
                          key={member.id}
                          className="search-result-item"
                          onClick={handleSelectTeam}
                        >
                          <div className="flex items-center gap-2">
                            <Users size={16} color="var(--text-muted)" />
                            <span className="text-body font-semibold">{member.name}</span>
                            <span className="text-caption">({member.email})</span>
                          </div>
                          <span className="badge badge-draft">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingAccounts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-metadata">SOCIAL ACCOUNTS ({matchingAccounts.length})</span>
                      {matchingAccounts.map(account => (
                        <div
                          key={account.id}
                          className="search-result-item"
                          onClick={handleSelectAccount}
                        >
                          <div className="flex items-center gap-2">
                            <Share2 size={16} color="var(--text-muted)" />
                            <span className="text-body font-medium">{account.name}</span>
                            <span className="text-caption">{account.username}</span>
                          </div>
                          <PlatformBadge platform={account.platform} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
