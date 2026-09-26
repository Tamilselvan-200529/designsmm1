import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: { char: string; name: string }[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: '😀',
    emojis: [
      { char: '😀', name: 'grinning face' },
      { char: '😃', name: 'smiling face with big eyes' },
      { char: '😄', name: 'smiling face with smiling eyes' },
      { char: '😁', name: 'beaming face' },
      { char: '😆', name: 'grinning squinting face' },
      { char: '😅', name: 'grinning face with sweat' },
      { char: '🤣', name: 'rolling on floor laughing' },
      { char: '😂', name: 'face with tears of joy' },
      { char: '🙂', name: 'slightly smiling face' },
      { char: '🙃', name: 'upside down face' },
      { char: '😉', name: 'winking face' },
      { char: '😊', name: 'smiling face with smiling eyes' },
      { char: '😇', name: 'smiling face with halo' },
      { char: '🥰', name: 'smiling face with hearts' },
      { char: '😍', name: 'smiling face with heart eyes' },
      { char: '🤩', name: 'star struck' },
      { char: '😘', name: 'face blowing a kiss' },
      { char: '😋', name: 'face savoring food' },
      { char: '😛', name: 'face with tongue' },
      { char: '😜', name: 'winking face with tongue' },
      { char: '🤪', name: 'zany face' },
      { char: '😎', name: 'smiling face with sunglasses' },
      { char: '🥳', name: 'partying face' },
      { char: '😏', name: 'smirking face' },
      { char: '😌', name: 'relieved face' },
      { char: '😴', name: 'sleeping face' },
      { char: '🤯', name: 'exploding head' },
      { char: '🤔', name: 'thinking face' },
      { char: '🤫', name: 'shushing face' },
      { char: '🫡', name: 'saluting face' },
      { char: '🤗', name: 'hugging face' },
      { char: '🥹', name: 'face holding back tears' },
    ]
  },
  {
    id: 'people',
    name: 'Gestures & People',
    icon: '👋',
    emojis: [
      { char: '👋', name: 'waving hand' },
      { char: '✋', name: 'raised hand' },
      { char: '🖐️', name: 'hand with fingers splayed' },
      { char: '👌', name: 'OK hand' },
      { char: '🤌', name: 'pinched fingers' },
      { char: '✌️', name: 'victory hand peace' },
      { char: '🤞', name: 'crossed fingers' },
      { char: '🫰', name: 'hand with index finger and thumb crossed' },
      { char: '🤟', name: 'love you gesture' },
      { char: '🤘', name: 'sign of the horns' },
      { char: '🤙', name: 'call me hand' },
      { char: '👈', name: 'backhand index pointing left' },
      { char: '👉', name: 'backhand index pointing right' },
      { char: '👆', name: 'backhand index pointing up' },
      { char: '👇', name: 'backhand index pointing down' },
      { char: '👍', name: 'thumbs up' },
      { char: '👎', name: 'thumbs down' },
      { char: '👊', name: 'oncoming fist' },
      { char: '👏', name: 'clapping hands' },
      { char: '🙌', name: 'raising hands' },
      { char: '🤝', name: 'handshake' },
      { char: '🙏', name: 'folded hands pray thank you' },
      { char: '✍️', name: 'writing hand' },
      { char: '💪', name: 'flexed biceps strength' },
      { char: '👀', name: 'eyes looking' },
      { char: '🧠', name: 'brain smart' },
      { char: '👤', name: 'silhouette' },
      { char: '👥', name: 'silhouettes team' }
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    emojis: [
      { char: '🌱', name: 'seedling organic vegan' },
      { char: '🥣', name: 'bowl with spoon soup cereal' },
      { char: '🍽️', name: 'fork and knife with plate restaurant' },
      { char: '🥗', name: 'green salad healthy' },
      { char: '🥖', name: 'baguette bread bakery' },
      { char: '🍕', name: 'pizza slice' },
      { char: '🍔', name: 'hamburger burger' },
      { char: '🍟', name: 'french fries' },
      { char: '🌭', name: 'hot dog' },
      { char: '🍿', name: 'popcorn movie' },
      { char: '🍣', name: 'sushi japanese' },
      { char: '🍱', name: 'bento box' },
      { char: '🍜', name: 'steaming bowl ramen noodle' },
      { char: '🌮', name: 'taco mexican' },
      { char: '🥑', name: 'avocado healthy' },
      { char: '🥦', name: 'broccoli vegetable' },
      { char: '🍎', name: 'red apple' },
      { char: '🍓', name: 'strawberry fresh' },
      { char: '🍇', name: 'grapes wine' },
      { char: '🍉', name: 'watermelon summer' },
      { char: '🍊', name: 'tangerine citrus' },
      { char: '🍋', name: 'lemon sour' },
      { char: '🥐', name: 'croissant breakfast' },
      { char: '🍰', name: 'shortcake dessert cake' },
      { char: '🍦', name: 'ice cream sweet' },
      { char: '🍩', name: 'doughnut donut' },
      { char: '🍪', name: 'cookie sweet snack' },
      { char: '☕', name: 'hot beverage coffee espresso' },
      { char: '🍵', name: 'teacup green tea matcha' },
      { char: '🧋', name: 'boba bubble tea' },
      { char: '🍷', name: 'wine glass red wine' },
      { char: '🍸', name: 'cocktail glass martini' },
      { char: '🍺', name: 'beer mug craft' },
      { char: '🥂', name: 'clinking glasses cheers celebration' },
    ]
  },
  {
    id: 'objects',
    name: 'Objects & Celebration',
    icon: '✨',
    emojis: [
      { char: '✨', name: 'sparkles shiny new' },
      { char: '🔥', name: 'fire hot trending flame' },
      { char: '🎉', name: 'party popper celebrate' },
      { char: '🎊', name: 'confetti ball celebration' },
      { char: '🎈', name: 'balloon birthday party' },
      { char: '🎁', name: 'wrapped gift present offer' },
      { char: '🏆', name: 'trophy winner champion' },
      { char: '🥇', name: 'first place medal gold' },
      { char: '🎯', name: 'bullseye target goal' },
      { char: '🚀', name: 'rocket launch growth fast' },
      { char: '💡', name: 'light bulb idea innovation' },
      { char: '📢', name: 'loudspeaker announcement update' },
      { char: '📣', name: 'megaphone shouting promo' },
      { char: '🔔', name: 'bell notification alert' },
      { char: '📸', name: 'camera flash photo photography' },
      { char: '🎥', name: 'movie camera video stream' },
      { char: '📱', name: 'mobile phone smartphone' },
      { char: '💻', name: 'laptop computer tech' },
      { char: '💼', name: 'briefcase work business' },
      { char: '📊', name: 'bar chart analytics growth' },
      { char: '📈', name: 'chart increasing upward trend' },
      { char: '📦', name: 'package box delivery shipping' },
      { char: '🏷️', name: 'label sale discount tag' },
      { char: '🛒', name: 'shopping cart ecommerce buy' },
      { char: '🛍️', name: 'shopping bags retail store' },
      { char: '💎', name: 'gem stone diamond premium luxury' },
      { char: '⭐', name: 'star rating favorite' },
      { char: '🌟', name: 'glowing star special' },
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Travel',
    icon: '🌴',
    emojis: [
      { char: '☀️', name: 'sun sunny day bright' },
      { char: '🌤️', name: 'sun behind small cloud' },
      { char: '⛅', name: 'sun behind cloud' },
      { char: '🌈', name: 'rainbow colorful' },
      { char: '⚡', name: 'high voltage lightning power' },
      { char: '❄️', name: 'snowflake cold winter' },
      { char: '🌊', name: 'water wave ocean sea' },
      { char: '🌲', name: 'evergreen tree forest outdoors' },
      { char: '🌴', name: 'palm tree tropical beach vacation' },
      { char: '🍀', name: 'four leaf clover luck lucky' },
      { char: '🌸', name: 'cherry blossom flower floral' },
      { char: '🌺', name: 'hibiscus flower tropical' },
      { char: '🌻', name: 'sunflower bloom yellow' },
      { char: '✈️', name: 'airplane travel trip vacation' },
      { char: '🏖️', name: 'beach with umbrella holiday' },
      { char: '🏕️', name: 'camping tent outdoor nature' },
      { char: '🏙️', name: 'cityscape city skyline' },
      { char: '🌆', name: 'cityscape at dusk sunset' },
      { char: '🌃', name: 'night with stars evening' },
      { char: '🌍', name: 'globe showing europe africa world' },
      { char: '🗺️', name: 'world map location journey' },
      { char: '📍', name: 'round pushpin map pin location here' },
    ]
  },
  {
    id: 'symbols',
    name: 'Symbols & Hearts',
    icon: '❤️',
    emojis: [
      { char: '❤️', name: 'red heart love passion' },
      { char: '🧡', name: 'orange heart' },
      { char: '💛', name: 'yellow heart friendship' },
      { char: '💚', name: 'green heart nature eco' },
      { char: '💙', name: 'blue heart loyalty peace' },
      { char: '💜', name: 'purple heart luxury magic' },
      { char: '🖤', name: 'black heart' },
      { char: '🤍', name: 'white heart pure' },
      { char: '💖', name: 'sparkling heart love affection' },
      { char: '💯', name: 'hundred points perfect score' },
      { char: '💥', name: 'collision boom impact' },
      { char: '💬', name: 'speech balloon comment chat' },
      { char: '🗨️', name: 'left speech bubble discussion' },
      { char: '💭', name: 'thought balloon think' },
      { char: '✅', name: 'check mark button verified approved done' },
      { char: '❌', name: 'cross mark cancel error' },
      { char: '⚠️', name: 'warning alert caution' },
      { char: '🔴', name: 'red circle live record' },
      { char: '🟢', name: 'green circle active online' },
      { char: '🔵', name: 'blue circle' },
      { char: '🟡', name: 'yellow circle' },
      { char: '🔥', name: 'fire lit trending' },
    ]
  }
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('smileys');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter emojis based on search
  const filteredEmojis = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    const results: { char: string; name: string }[] = [];
    EMOJI_CATEGORIES.forEach(cat => {
      cat.emojis.forEach(e => {
        if (e.name.toLowerCase().includes(term) || e.char.includes(term)) {
          if (!results.some(r => r.char === e.char)) {
            results.push(e);
          }
        }
      });
    });
    return results;
  }, [searchTerm]);

  const activeCategory = EMOJI_CATEGORIES.find(c => c.id === activeTab) || EMOJI_CATEGORIES[0];

  return (
    <div 
      className="emoji-picker-container"
      onClick={e => e.stopPropagation()}
    >
      {/* Header with Search and Close */}
      <div className="emoji-picker-header">
        <div className="emoji-search-box">
          <Search size={14} className="emoji-search-icon" />
          <input
            type="text"
            className="emoji-search-input"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button 
              type="button" 
              className="emoji-search-clear" 
              onClick={() => setSearchTerm('')}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <button 
          type="button" 
          className="emoji-picker-close-btn"
          onClick={onClose}
          aria-label="Close emoji picker"
        >
          <X size={14} />
        </button>
      </div>

      {/* Category Navigation Pills (when not searching) */}
      {!searchTerm && (
        <div className="emoji-category-tabs">
          {EMOJI_CATEGORIES.map(category => (
            <button
              key={category.id}
              type="button"
              className={`emoji-cat-tab ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
              title={category.name}
            >
              <span className="emoji-cat-icon">{category.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="emoji-grid-scroll">
        {searchTerm ? (
          <div>
            <div className="emoji-group-title">
              Search Results ({filteredEmojis?.length || 0})
            </div>
            {filteredEmojis && filteredEmojis.length > 0 ? (
              <div className="emoji-grid">
                {filteredEmojis.map(emoji => (
                  <button
                    key={emoji.char + emoji.name}
                    type="button"
                    className="emoji-item-btn"
                    title={emoji.name}
                    onClick={() => onSelectEmoji(emoji.char)}
                  >
                    {emoji.char}
                  </button>
                ))}
              </div>
            ) : (
              <div className="emoji-no-results">
                <span>No emojis matching "{searchTerm}"</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="emoji-group-title">
              {activeCategory.name}
            </div>
            <div className="emoji-grid">
              {activeCategory.emojis.map(emoji => (
                <button
                  key={emoji.char + emoji.name}
                  type="button"
                  className="emoji-item-btn"
                  title={emoji.name}
                  onClick={() => onSelectEmoji(emoji.char)}
                >
                  {emoji.char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Quick Access */}
      <div className="emoji-picker-footer">
        <span className="text-caption" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Click an emoji to insert • 180+ emojis available
        </span>
      </div>
    </div>
  );
};
