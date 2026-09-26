import { 
  Organization, 
  Brand,
  SocialAccount, 
  Post, 
  MediaItem, 
  TeamMember, 
  NotificationItem, 
  PublishingLogItem,
  DashboardMetricSummary,
  TeamMemberPermissions,
  RolePermissionSet,
  UserRole
} from '../types';

import { 
  DEFAULT_ROLE_PERMISSIONS, 
  ALL_ROLES, 
  ROLE_DESCRIPTIONS 
} from '../utils/rbac';

export const makePermissions = (role: UserRole): TeamMemberPermissions => {
  return JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS[role]));
};

// ============================================================
// ROLE PERMISSIONS MATRIX (for Roles & Permissions view)
// ============================================================
export const ROLE_PERMISSIONS_MATRIX: RolePermissionSet[] = ALL_ROLES.map(role => ({
  role,
  description: ROLE_DESCRIPTIONS[role],
  permissions: makePermissions(role)
}));


// ============================================================
// ORGANIZATIONS (Multi-tenant)
// ============================================================
export const initialOrganizations: Organization[] = [
  {
    id: 'org-acme',
    name: 'Acme Digital Agency',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    website: 'https://acmedigital.agency',
    industry: 'Digital Marketing & Growth',
    plan: 'Agency'
  },
  {
    id: 'org-xyz',
    name: 'XYZ Marketing Group',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80',
    website: 'https://xyzmarketing.io',
    industry: 'Performance Marketing & Brand Strategy',
    plan: 'Professional'
  },
  {
    id: 'org-apex',
    name: 'Apex Growth Media',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    website: 'https://apexmedia.co',
    industry: 'Enterprise Social Commerce',
    plan: 'Enterprise'
  }
];

export const initialOrganization: Organization = initialOrganizations[0];

// ============================================================
// BRANDS (replacing Workspaces)
// ============================================================
export const initialBrands: Brand[] = [
  {
    id: 'brand-restaurant',
    name: 'GreenLeaf Restaurant',
    description: 'Farm-to-table fine dining restaurant showcasing locally sourced seasonal ingredients.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    website: 'https://greenleafbistro.com',
    timezone: 'America/New_York (EST)',
    industry: 'Hospitality & Fine Dining',
    organizationId: 'org-acme',
    postCount: 154,
    accountCount: 5,
    memberCount: 8,
    color: '#16a34a'
  },
  {
    id: 'brand-urban',
    name: 'Urban Threads',
    description: 'Sustainable urban apparel brand for the conscious, style-forward consumer.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80',
    website: 'https://urbanthreads.eco',
    timezone: 'America/Los_Angeles (PST)',
    industry: 'Sustainable Apparel & Fashion',
    organizationId: 'org-acme',
    postCount: 88,
    accountCount: 4,
    memberCount: 5,
    color: '#7c3aed'
  },
  {
    id: 'brand-nova',
    name: 'Nova Smart Tech',
    description: 'Consumer electronics and audio brand delivering next-generation smart devices.',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&auto=format&fit=crop&q=80',
    website: 'https://novagadgets.io',
    timezone: 'Europe/London (GMT)',
    industry: 'Consumer Electronics & Audio',
    organizationId: 'org-acme',
    postCount: 42,
    accountCount: 3,
    memberCount: 6,
    color: '#2563eb'
  },
  {
    id: 'brand-wellnest',
    name: 'WellNest Health',
    description: 'Holistic health and wellness platform empowering individuals through evidence-based content.',
    logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&auto=format&fit=crop&q=80',
    website: 'https://wellnesthealth.co',
    timezone: 'Asia/Kolkata (IST)',
    industry: 'Health & Wellness',
    organizationId: 'org-acme',
    postCount: 29,
    accountCount: 3,
    memberCount: 6,
    color: '#0891b2'
  },
  // XYZ Marketing Group brands (Multi-tenant demonstration)
  {
    id: 'brand-xyz-quantum',
    name: 'Quantum Retail',
    description: 'Direct-to-consumer sustainable home goods and modern living essentials.',
    logo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop&q=80',
    website: 'https://quantumretail.shop',
    timezone: 'America/Chicago (CST)',
    industry: 'Consumer Goods & Retail',
    organizationId: 'org-xyz',
    postCount: 38,
    accountCount: 3,
    memberCount: 4,
    color: '#0284c7'
  },
  {
    id: 'brand-xyz-sunrise',
    name: 'Sunrise Cafe',
    description: 'Artisanal roastery and cafe chain with 12 metropolitan locations.',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&auto=format&fit=crop&q=80',
    website: 'https://sunrisecafebrew.com',
    timezone: 'America/Denver (MST)',
    industry: 'Food & Beverage',
    organizationId: 'org-xyz',
    postCount: 52,
    accountCount: 2,
    memberCount: 3,
    color: '#d97706'
  },
  // Apex Growth Media brands (Multi-tenant demonstration)
  {
    id: 'brand-apex-peak',
    name: 'Peak Athletics',
    description: 'High performance activewear and community driven fitness challenges.',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=80',
    website: 'https://peakathletics.fit',
    timezone: 'America/New_York (EST)',
    industry: 'Athletics & Fitness',
    organizationId: 'org-apex',
    postCount: 64,
    accountCount: 4,
    memberCount: 6,
    color: '#dc2626'
  },
  {
    id: 'brand-apex-lumina',
    name: 'Lumina Skincare',
    description: 'Clinical grade dermatologist backed daily ritual skincare.',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    website: 'https://luminaskin.co',
    timezone: 'Europe/Paris (CET)',
    industry: 'Health & Beauty',
    organizationId: 'org-apex',
    postCount: 29,
    accountCount: 3,
    memberCount: 4,
    color: '#db2777'
  }
];

// ============================================================
// ============================================================
// SOCIAL ACCOUNTS - isolated per Brand (brandId)
// Includes: token details, OAuth scopes, member assignments, health indicators
// ============================================================
export const initialSocialAccounts: SocialAccount[] = [
  // GreenLeaf Restaurant
  {
    id: 'acc-ig-restaurant',
    platform: 'instagram',
    name: 'GreenLeaf Restaurant',
    username: '@greenleafrestaurant',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-restaurant',
    lastSynced: '12 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'Dec 15, 2026',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex-restaurant', 'usr-priya-restaurant', 'usr-arun-restaurant'],
    metrics: { followers: 14280, engagementRate: 5.2, postsThisMonth: 18, reach: 42600, impressions: 118400 }
  },
  {
    id: 'acc-fb-restaurant',
    platform: 'facebook',
    name: 'GreenLeaf Bistro & Bar',
    username: 'greenleafbistro',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-restaurant',
    lastSynced: '24 mins ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Nov 30, 2026',
    oauthScopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_metadata'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex-restaurant', 'usr-priya-restaurant'],
    metrics: { followers: 8940, engagementRate: 3.4, postsThisMonth: 14, reach: 28100, impressions: 74200 }
  },
  {
    id: 'acc-li-restaurant',
    platform: 'linkedin',
    name: 'GreenLeaf Hospitality Group',
    username: 'greenleaf-hospitality',
    avatar: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-restaurant',
    lastSynced: '1 hour ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Jan 8, 2027',
    oauthScopes: ['w_member_social', 'r_organization_social', 'rw_organization_admin'],
    apiVersion: 'v2',
    assignedMemberIds: ['usr-alex-restaurant', 'usr-priya-restaurant', 'usr-arun-restaurant'],
    metrics: { followers: 3410, engagementRate: 6.1, postsThisMonth: 9, reach: 14200, impressions: 38900 }
  },
  {
    id: 'acc-tt-restaurant',
    platform: 'tiktok',
    name: 'GreenLeaf Eats',
    username: '@greenleafrestaurant',
    avatar: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&auto=format&fit=crop&q=80',
    status: 'expiring',
    expiresInDays: 2,
    brandId: 'brand-restaurant',
    lastSynced: '3 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Sep 25, 2026',
    oauthScopes: ['video.publish', 'user.info.basic', 'video.list'],
    apiVersion: 'v2.0',
    assignedMemberIds: ['usr-arun-restaurant'],
    errorMessage: 'OAuth token expires in 48 hours. Refresh authentication to continue scheduling.',
    metrics: { followers: 28500, engagementRate: 9.3, postsThisMonth: 22, reach: 186000, impressions: 412000 }
  },
  {
    id: 'acc-yt-restaurant',
    platform: 'youtube',
    name: 'GreenLeaf Kitchen Official',
    username: 'GreenLeafKitchen',
    avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-restaurant',
    lastSynced: '5 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Feb 14, 2027',
    oauthScopes: ['youtube.upload', 'youtube.readonly', 'yt-analytics.readonly'],
    apiVersion: 'v3',
    assignedMemberIds: ['usr-alex-restaurant', 'usr-priya-restaurant'],
    metrics: { followers: 6420, engagementRate: 4.7, postsThisMonth: 6, reach: 31400, impressions: 88600 }
  },
  // Urban Threads
  {
    id: 'acc-ig-urban',
    platform: 'instagram',
    name: 'Urban Threads Official',
    username: '@urbanthreads',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-urban',
    lastSynced: '30 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'Mar 22, 2027',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex-urban', 'usr-priya-urban', 'usr-david-urban'],
    metrics: { followers: 22400, engagementRate: 4.8, postsThisMonth: 26, reach: 98200, impressions: 274000 }
  },
  {
    id: 'acc-fb-urban',
    platform: 'facebook',
    name: 'Urban Threads Apparel',
    username: 'urbanthreadsapparel',
    avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-urban',
    lastSynced: '1 hour ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Dec 1, 2026',
    oauthScopes: ['pages_manage_posts', 'pages_read_engagement'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex-urban', 'usr-priya-urban'],
    metrics: { followers: 11200, engagementRate: 2.9, postsThisMonth: 16, reach: 44100, impressions: 108000 }
  },
  {
    id: 'acc-tt-urban',
    platform: 'tiktok',
    name: 'Urban Threads Style',
    username: '@urbanthreadsstyle',
    avatar: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-urban',
    lastSynced: '2 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Nov 18, 2026',
    oauthScopes: ['video.publish', 'user.info.basic'],
    apiVersion: 'v2.0',
    assignedMemberIds: ['usr-alex-urban', 'usr-david-urban'],
    metrics: { followers: 41000, engagementRate: 11.2, postsThisMonth: 34, reach: 312000, impressions: 748000 }
  },
  {
    id: 'acc-yt-urban',
    platform: 'youtube',
    name: 'Urban Threads TV',
    username: 'UrbanThreadsTV',
    avatar: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&auto=format&fit=crop&q=80',
    status: 'failed',
    brandId: 'brand-urban',
    lastSynced: '2 days ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Expired',
    oauthScopes: ['youtube.upload', 'youtube.readonly'],
    apiVersion: 'v3',
    assignedMemberIds: [],
    errorMessage: 'YouTube API credentials revoked. Re-authentication required to restore publishing access.',
    metrics: { followers: 3800, engagementRate: 3.1, postsThisMonth: 0, reach: 0, impressions: 0 }
  },
  // Nova Smart Tech
  {
    id: 'acc-ig-nova',
    platform: 'instagram',
    name: 'Nova Smart Tech',
    username: '@novasmarttech',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-nova',
    lastSynced: '45 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'Apr 5, 2027',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex-nova', 'usr-priya-nova', 'usr-elena-nova'],
    metrics: { followers: 9800, engagementRate: 3.7, postsThisMonth: 12, reach: 38200, impressions: 96400 }
  },
  {
    id: 'acc-li-nova',
    platform: 'linkedin',
    name: 'Nova Smart Tech Corp',
    username: 'nova-smart-tech',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-nova',
    lastSynced: '2 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Jan 20, 2027',
    oauthScopes: ['w_member_social', 'r_organization_social', 'rw_organization_admin'],
    apiVersion: 'v2',
    assignedMemberIds: ['usr-alex-nova', 'usr-priya-nova'],
    metrics: { followers: 5640, engagementRate: 7.2, postsThisMonth: 8, reach: 22100, impressions: 64800 }
  },
  {
    id: 'acc-yt-nova',
    platform: 'youtube',
    name: 'Nova Tech Reviews',
    username: 'NovaTechReviews',
    avatar: 'https://images.unsplash.com/photo-1535223289429-462edb9cc7b5?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-nova',
    lastSynced: '3 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Feb 28, 2027',
    oauthScopes: ['youtube.upload', 'youtube.readonly', 'yt-analytics.readonly'],
    apiVersion: 'v3',
    assignedMemberIds: ['usr-alex-nova', 'usr-elena-nova'],
    metrics: { followers: 18200, engagementRate: 5.8, postsThisMonth: 7, reach: 88400, impressions: 218000 }
  },
  // WellNest Health
  {
    id: 'acc-ig-wellnest',
    platform: 'instagram',
    name: 'WellNest Health',
    username: '@wellnesthealth',
    avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-wellnest',
    lastSynced: '20 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'Mar 10, 2027',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-fatima', 'usr-liam'],
    metrics: { followers: 31200, engagementRate: 6.4, postsThisMonth: 28, reach: 142000, impressions: 389000 }
  },
  {
    id: 'acc-fb-wellnest',
    platform: 'facebook',
    name: 'WellNest Health Community',
    username: 'wellnesthealth',
    avatar: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-wellnest',
    lastSynced: '1 hour ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Dec 20, 2026',
    oauthScopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_metadata'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-fatima', 'usr-liam'],
    metrics: { followers: 14800, engagementRate: 4.1, postsThisMonth: 18, reach: 58400, impressions: 146000 }
  },
  {
    id: 'acc-yt-wellnest',
    platform: 'youtube',
    name: 'WellNest Wellness Channel',
    username: 'WellNestHealth',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&auto=format&fit=crop&q=80',
    status: 'expiring',
    expiresInDays: 5,
    brandId: 'brand-wellnest',
    lastSynced: '4 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Sep 28, 2026',
    oauthScopes: ['youtube.upload', 'youtube.readonly', 'yt-analytics.readonly'],
    apiVersion: 'v3',
    assignedMemberIds: ['usr-fatima'],
    errorMessage: 'YouTube OAuth token will expire in 5 days. Reconnect to maintain scheduled publishing.',
    metrics: { followers: 8900, engagementRate: 5.0, postsThisMonth: 4, reach: 34600, impressions: 92000 }
  },
  // Quantum Retail (XYZ Marketing Group)
  {
    id: 'acc-ig-quantum',
    platform: 'instagram',
    name: 'Quantum Retail Living',
    username: '@quantumretail',
    avatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-xyz-quantum',
    lastSynced: '15 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'May 12, 2027',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex', 'usr-muthu'],
    metrics: { followers: 16800, engagementRate: 4.9, postsThisMonth: 18, reach: 64000, impressions: 142000 }
  },
  {
    id: 'acc-li-quantum',
    platform: 'linkedin',
    name: 'Quantum Retail Group',
    username: 'quantum-retail',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-xyz-quantum',
    lastSynced: '1 hour ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Jan 20, 2027',
    oauthScopes: ['w_member_social', 'r_organization_social'],
    apiVersion: 'v2',
    assignedMemberIds: ['usr-alex'],
    metrics: { followers: 4200, engagementRate: 5.3, postsThisMonth: 8, reach: 18000, impressions: 45000 }
  },
  // Sunrise Cafe (XYZ Marketing Group)
  {
    id: 'acc-ig-sunrise',
    platform: 'instagram',
    name: 'Sunrise Cafe & Roastery',
    username: '@sunrisecafebrew',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-xyz-sunrise',
    lastSynced: '35 mins ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Dec 15, 2026',
    oauthScopes: ['instagram_basic', 'instagram_content_publish'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex'],
    metrics: { followers: 19400, engagementRate: 6.2, postsThisMonth: 21, reach: 72000, impressions: 168000 }
  },
  // Peak Athletics (Apex Growth Media)
  {
    id: 'acc-ig-peak',
    platform: 'instagram',
    name: 'Peak Athletics Official',
    username: '@peakathletics',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-apex-peak',
    lastSynced: '10 mins ago',
    tokenType: 'Long-lived',
    tokenExpiresAt: 'Jun 30, 2027',
    oauthScopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiVersion: 'v18.0',
    assignedMemberIds: ['usr-alex'],
    metrics: { followers: 45200, engagementRate: 7.1, postsThisMonth: 34, reach: 189000, impressions: 420000 }
  },
  {
    id: 'acc-yt-peak',
    platform: 'youtube',
    name: 'Peak Athletics Workout Hub',
    username: 'PeakAthleticsHQ',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-apex-peak',
    lastSynced: '2 hours ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Mar 18, 2027',
    oauthScopes: ['youtube.upload', 'youtube.readonly'],
    apiVersion: 'v3',
    assignedMemberIds: ['usr-alex'],
    metrics: { followers: 12800, engagementRate: 5.9, postsThisMonth: 10, reach: 58000, impressions: 134000 }
  },
  // Lumina Skincare (Apex Growth Media)
  {
    id: 'acc-tt-lumina',
    platform: 'tiktok',
    name: 'Lumina Skincare Lab',
    username: '@luminaskin',
    avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&auto=format&fit=crop&q=80',
    status: 'connected',
    brandId: 'brand-apex-lumina',
    lastSynced: '40 mins ago',
    tokenType: 'OAuth2',
    tokenExpiresAt: 'Aug 14, 2027',
    oauthScopes: ['video.publish', 'user.info.basic'],
    apiVersion: 'v2.0',
    assignedMemberIds: [],
    metrics: { followers: 32600, engagementRate: 8.8, postsThisMonth: 25, reach: 154000, impressions: 340000 }
  }
];

// ============================================================
// TEAM MEMBERS â€” brand-scoped; Alex Morgan has different roles per brand
// Requirement 27: Same user â†’ different brand â†’ different role
// GreenLeaf: Contributor | Urban Threads: Admin | Nova: Manager | WellNest: Contributor
// ============================================================
export const initialTeamMembers: TeamMember[] = [
  // GreenLeaf Restaurant — Marcus Vance: Owner
  {
    id: 'usr-marcus-restaurant',
    name: 'Marcus Vance',
    email: 'marcus@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: 'Just now',
    permissions: makePermissions('Owner')
  },
  // GreenLeaf Restaurant — Jordan Lee: Admin
  {
    id: 'usr-jordan-restaurant',
    name: 'Jordan Lee',
    email: 'jordan@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '10 mins ago',
    permissions: makePermissions('Admin')
  },
  // GreenLeaf Restaurant — Chloe Bennett: Editor
  {
    id: 'usr-chloe-restaurant',
    name: 'Chloe Bennett',
    email: 'chloe@greenleafbistro.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant'],
    status: 'active',
    lastActive: '30 mins ago',
    permissions: makePermissions('Editor')
  },
  // GreenLeaf Restaurant — Alex Morgan: Contributor
  {
    id: 'usr-alex-restaurant',
    name: 'Alex Morgan',
    email: 'alex@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Contributor',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '5 mins ago',
    permissions: makePermissions('Contributor')
  },
  {
    id: 'usr-priya-restaurant',
    name: 'Priya Sharma',
    email: 'priya@greenleafbistro.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Manager',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant'],
    status: 'active',
    lastActive: '2 hours ago',
    permissions: makePermissions('Manager')
  },
  {
    id: 'usr-arun-restaurant',
    name: 'Arun Kumar',
    email: 'arun@greenleafbistro.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant'],
    status: 'active',
    lastActive: 'Yesterday',
    permissions: makePermissions('Editor')
  },
  {
    id: 'usr-sarah-restaurant',
    name: 'Sarah Wilson',
    email: 'sarah@greenleafbistro.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Client',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant'],
    status: 'active',
    lastActive: '1 day ago',
    permissions: makePermissions('Client')
  },
  {
    id: 'usr-karthik-restaurant',
    name: 'Karthik',
    email: 'karthik@greenleafbistro.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    brandId: 'brand-restaurant',
    brandIds: ['brand-restaurant'],
    status: 'active',
    lastActive: '3 hours ago',
    permissions: makePermissions('Analyst')
  },
  // Urban Threads — Marcus Vance: Owner
  {
    id: 'usr-marcus-urban',
    name: 'Marcus Vance',
    email: 'marcus@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    brandId: 'brand-urban',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: 'Just now',
    permissions: makePermissions('Owner')
  },
  // Urban Threads — Alex Morgan: Admin
  {
    id: 'usr-alex-urban',
    name: 'Alex Morgan',
    email: 'alex@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    brandId: 'brand-urban',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '5 mins ago',
    permissions: makePermissions('Admin')
  },
  {
    id: 'usr-karthik-urban',
    name: 'Karthik',
    email: 'karthik@urbanthreads.eco',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    brandId: 'brand-urban',
    brandIds: ['brand-urban'],
    status: 'active',
    lastActive: '2 days ago',
    permissions: makePermissions('Analyst')
  },
  {
    id: 'usr-david-urban',
    name: 'David Kumar',
    email: 'david@urbanthreads.eco',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    brandId: 'brand-urban',
    brandIds: ['brand-urban'],
    status: 'active',
    lastActive: 'Today at 10 AM',
    permissions: makePermissions('Editor')
  },
  {
    id: 'usr-priya-urban',
    name: 'Priya Sharma',
    email: 'priya@urbanthreads.eco',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Manager',
    brandId: 'brand-urban',
    brandIds: ['brand-urban'],
    status: 'active',
    lastActive: '1 hour ago',
    permissions: makePermissions('Manager')
  },
  // Nova Smart Tech — Marcus Vance: Owner
  {
    id: 'usr-marcus-nova',
    name: 'Marcus Vance',
    email: 'marcus@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    brandId: 'brand-nova',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: 'Just now',
    permissions: makePermissions('Owner')
  },
  // Nova Smart Tech — Chloe Bennett: Editor
  {
    id: 'usr-chloe-nova',
    name: 'Chloe Bennett',
    email: 'chloe@novagadgets.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    brandId: 'brand-nova',
    brandIds: ['brand-restaurant', 'brand-nova'],
    status: 'active',
    lastActive: '15 mins ago',
    permissions: makePermissions('Editor')
  },
  // Nova Smart Tech — Alex Morgan: Manager
  {
    id: 'usr-alex-nova',
    name: 'Alex Morgan',
    email: 'alex@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Manager',
    brandId: 'brand-nova',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '5 mins ago',
    permissions: makePermissions('Manager')
  },
  {
    id: 'usr-ryan-nova',
    name: 'Ryan Chen',
    email: 'ryan@novagadgets.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    role: 'Client',
    brandId: 'brand-nova',
    brandIds: ['brand-nova'],
    status: 'invited',
    lastActive: 'Invitation sent',
    permissions: makePermissions('Client')
  },
  {
    id: 'usr-elena-nova',
    name: 'Elena Rostova',
    email: 'elena@novagadgets.io',
    avatar: 'https://images.unsplash.com/photo-1601758174493-d5b6b01e0b94?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    brandId: 'brand-nova',
    brandIds: ['brand-nova'],
    status: 'active',
    lastActive: 'Today',
    permissions: makePermissions('Analyst')
  },
  {
    id: 'usr-priya-nova',
    name: 'Priya Sharma',
    email: 'priya@novagadgets.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    brandId: 'brand-nova',
    brandIds: ['brand-nova'],
    status: 'active',
    lastActive: '4 hours ago',
    permissions: makePermissions('Admin')
  },
  // WellNest Health — Marcus Vance: Owner
  {
    id: 'usr-marcus-wellnest',
    name: 'Marcus Vance',
    email: 'marcus@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    brandId: 'brand-wellnest',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: 'Just now',
    permissions: makePermissions('Owner')
  },
  // WellNest Health — Jordan Lee: Admin
  {
    id: 'usr-jordan-wellnest',
    name: 'Jordan Lee',
    email: 'jordan@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    brandId: 'brand-wellnest',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '10 mins ago',
    permissions: makePermissions('Admin')
  },
  // WellNest Health — Alex Morgan: Contributor
  {
    id: 'usr-fatima',
    name: 'Fatima Al-Hassan',
    email: 'fatima@wellnesthealth.com',
    avatar: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=100&auto=format&fit=crop&q=80',
    role: 'Manager',
    brandId: 'brand-wellnest',
    brandIds: ['brand-wellnest'],
    status: 'active',
    lastActive: '30 mins ago',
    permissions: makePermissions('Manager')
  },
  {
    id: 'usr-liam',
    name: 'Liam Foster',
    email: 'liam@wellnesthealth.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
    brandId: 'brand-wellnest',
    brandIds: ['brand-wellnest'],
    status: 'active',
    lastActive: 'Yesterday',
    permissions: makePermissions('Editor')
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Krishnan',
    email: 'ananya@wellnesthealth.co',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&auto=format&fit=crop&q=80',
    role: 'Client',
    brandId: 'brand-wellnest',
    brandIds: ['brand-wellnest'],
    status: 'active',
    lastActive: '3 days ago',
    permissions: makePermissions('Client')
  },
  {
    id: 'usr-alex-wellnest',
    name: 'Alex Morgan',
    email: 'alex@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Contributor',
    brandId: 'brand-wellnest',
    brandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    status: 'active',
    lastActive: '5 mins ago',
    permissions: makePermissions('Contributor')
  }
];

// ============================================================
// POSTS — isolated per Brand (brandId)
// ============================================================
export const initialPosts: Post[] = [
  // ── GreenLeaf Restaurant posts ──
  {
    id: 'post-1',
    brandId: 'brand-restaurant',
    platforms: ['instagram', 'facebook'],
    content: 'Introducing Chef Julian\'s seasonal autumn squash velouté with toasted pumpkin seed oil and organic sourdough croutons. Available starting this Friday evening! Reserve your table at the link in bio. 🍂🥣 #FarmToTable #SeasonalMenu #ChefSpecial #BistroDining',
    platformCustomizations: {
      instagram: 'Introducing Chef Julian\'s seasonal autumn squash velouté with toasted pumpkin seed oil and organic sourdough croutons. Available starting this Friday evening! Reserve at the link in bio. 🍂🥣\n\n#FarmToTable #SeasonalMenu #ChefSpecial #BistroDining #FoodieLife',
      facebook: 'Introducing Chef Julian\'s seasonal autumn squash velouté with toasted pumpkin seed oil and organic sourdough croutons. Available starting this Friday evening! Book your reservation at greenleafbistro.com/reserve 🍂'
    },
    mediaUrls: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'scheduled',
    scheduledTime: 'Tomorrow at 6:30 PM',
    createdAt: '2026-09-22T10:00:00Z',
    author: { id: 'usr-david', name: 'David Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'Editor' },
    approvalStage: 'Scheduled',
    comments: [{ id: 'c-1', authorName: 'Sarah Lee', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', authorRole: 'Manager', content: 'Photography looks mouth-watering! Approved for tomorrow\'s prime evening slot.', createdAt: '2 hours ago' }],
    auditLog: [
      { id: 'a-1', action: 'Created draft', user: 'David Kumar', timestamp: 'Yesterday at 3:15 PM' },
      { id: 'a-2', action: 'Submitted for Manager Review', user: 'David Kumar', timestamp: 'Yesterday at 4:00 PM' },
      { id: 'a-3', action: 'Approved and Scheduled', user: 'Sarah Lee', timestamp: '2 hours ago' }
    ]
  },
  {
    id: 'post-2',
    brandId: 'brand-restaurant',
    platforms: ['instagram', 'facebook', 'linkedin'],
    content: 'Behind the scenes with our local organic produce suppliers at Sunrise Valley Farm. Every ingredient on your plate travels less than 40 miles from harvest to table. 🌿🥕 #SustainableEating #LocalFarms #FarmFresh #GreenLeafEats',
    mediaUrls: ['https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'published',
    publishedTime: 'Today at 11:15 AM',
    createdAt: '2026-09-21T09:00:00Z',
    author: { id: 'usr-sarah', name: 'Sarah Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Published',
    comments: [],
    auditLog: [{ id: 'a-4', action: 'Published to 3 platforms', user: 'Sarah Lee', timestamp: 'Today at 11:15 AM' }],
    metrics: { likes: 1240, comments: 86, shares: 42, reach: 18400, impressions: 24900 }
  },
  {
    id: 'post-3',
    brandId: 'brand-restaurant',
    platforms: ['instagram', 'facebook', 'tiktok'],
    content: 'Weekend Brunch Announcement: Poached duck eggs on house-made brioche with wild mushroom compote and truffle hollandaise. Join us Saturday & Sunday 10am-3pm! Tag your brunch crew. 🍳🥂 #WeekendBrunch #FoodieAdventures #BrunchVibes',
    mediaUrls: ['https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'pending',
    scheduledTime: 'Saturday at 9:00 AM',
    createdAt: '2026-09-23T08:30:00Z',
    author: { id: 'usr-david', name: 'David Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'Editor' },
    approvalStage: 'Manager Review',
    comments: [{ id: 'c-2', authorName: 'David Kumar', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', authorRole: 'Editor', content: '@Sarah please review the brunch copy and confirm if table bookings require deposits.', createdAt: '45 mins ago' }],
    auditLog: [
      { id: 'a-5', action: 'Created post', user: 'David Kumar', timestamp: 'Today at 8:30 AM' },
      { id: 'a-6', action: 'Requested Manager Review', user: 'David Kumar', timestamp: '45 mins ago' }
    ]
  },
  {
    id: 'post-4',
    brandId: 'brand-restaurant',
    platforms: ['instagram', 'linkedin'],
    content: 'Announcing our Autumn Harvest Wine Pairing Dinner: 5 courses paired with biodynamic wines from Willamette Valley. Limited to 32 guests. Early bird tickets release tomorrow at 9 AM EST.',
    mediaUrls: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'draft',
    createdAt: '2026-09-22T14:20:00Z',
    author: { id: 'usr-alex', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Owner' },
    approvalStage: 'Draft',
    comments: [],
    auditLog: [{ id: 'a-7', action: 'Draft saved', user: 'Alex Morgan', timestamp: 'Yesterday at 2:20 PM' }]
  },
  {
    id: 'post-rejected-demo',
    brandId: 'brand-restaurant',
    platforms: ['linkedin', 'facebook'],
    content: 'Special promo: 50% discount on all cocktails this Friday after 9 PM! Walk-ins only, first come first served.',
    mediaUrls: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'rejected',
    createdAt: '2026-09-24T11:00:00Z',
    author: { id: 'usr-alex', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Contributor' },
    rejectionReason: 'Discount percentage is inaccurate. Please revise to 25% happy hour rate.',
    comments: [],
    auditLog: [
      { id: 'a-rj-1', action: 'Created draft and submitted for approval', user: 'Alex Morgan', timestamp: 'Yesterday at 11:00 AM' },
      { id: 'a-rj-2', action: 'Rejected by Manager', user: 'Sarah Lee', timestamp: 'Yesterday at 2:30 PM' }
    ]
  },
  {
    id: 'post-5',
    brandId: 'brand-restaurant',
    platforms: ['instagram', 'facebook', 'linkedin', 'youtube'],
    content: 'Crispy pan-seared wild king salmon over saffron risotto and charred asparagus. Watch the full prep guide on YouTube. 🐟✨ #WildSalmon #CulinaryArt #DinnerGoals #ChefLife',
    mediaUrls: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'published',
    publishedTime: 'Sep 20 at 7:00 PM',
    createdAt: '2026-09-19T11:00:00Z',
    author: { id: 'usr-sarah', name: 'Sarah Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Published',
    comments: [],
    auditLog: [{ id: 'a-8', action: 'Published to 4 platforms', user: 'Sarah Lee', timestamp: 'Sep 20 at 7:00 PM' }],
    metrics: { likes: 2180, comments: 142, shares: 98, reach: 32600, impressions: 48200 }
  },
  {
    id: 'post-6',
    brandId: 'brand-restaurant',
    platforms: ['tiktok', 'youtube'],
    content: 'Master the perfect French butter basting technique with Chef Julian in under 60 seconds! 🧈🔥 #CookingTips #KitchenHacks #ChefSkills #FoodTikTok',
    mediaUrls: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'video',
    status: 'failed',
    createdAt: '2026-09-23T06:00:00Z',
    author: { id: 'usr-david', name: 'David Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'Editor' },
    rejectionReason: 'TikTok API rate limit exceeded during video upload. Click Retry to re-dispatch.',
    comments: [],
    auditLog: [
      { id: 'a-9', action: 'Publishing attempted', user: 'System Worker', timestamp: 'Today at 6:02 AM' },
      { id: 'a-10', action: 'Publishing failed with Rate Limit error', user: 'System Worker', timestamp: 'Today at 6:03 AM' }
    ]
  },
  // ── Urban Threads posts ──
  {
    id: 'post-7',
    brandId: 'brand-urban',
    platforms: ['instagram', 'tiktok'],
    content: 'Introducing the Autumn Harvest collection — sustainable fabrics, earthy tones, modern silhouettes. Conscious fashion for the city. 🍂👕 #SustainableFashion #UrbanThreads #EcoStyle #SlowFashion',
    mediaUrls: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'published',
    publishedTime: 'Yesterday at 3:00 PM',
    createdAt: '2026-09-22T10:00:00Z',
    author: { id: 'usr-mia', name: 'Mia Chen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Published',
    comments: [],
    auditLog: [{ id: 'a-11', action: 'Published to 2 platforms', user: 'Mia Chen', timestamp: 'Yesterday at 3:00 PM' }],
    metrics: { likes: 890, comments: 54, shares: 28, reach: 14200, impressions: 19600 }
  },
  {
    id: 'post-8',
    brandId: 'brand-urban',
    platforms: ['instagram', 'facebook', 'tiktok'],
    content: 'Behind the stitches: our production team in Jaipur crafts every piece with care. Fair wages, ethical sourcing, zero compromise. 🧵♻️ #EthicalFashion #MadeWithCare #FairTrade #UrbanThreads',
    mediaUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'pending',
    scheduledTime: 'Friday at 12:00 PM',
    createdAt: '2026-09-23T09:00:00Z',
    author: { id: 'usr-arun', name: 'Arun Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', role: 'Editor' },
    approvalStage: 'Manager Review',
    comments: [],
    auditLog: [
      { id: 'a-12', action: 'Created post', user: 'Arun Patel', timestamp: 'Today at 9:00 AM' },
      { id: 'a-13', action: 'Submitted for review', user: 'Arun Patel', timestamp: 'Today at 9:30 AM' }
    ]
  },
  {
    id: 'post-9',
    brandId: 'brand-urban',
    platforms: ['instagram'],
    content: 'New drop: The Linen Utility Jacket in Desert Sand and Forest Green. Limited stock. Shop now via link in bio. 🌿 #NewDrop #UrbanThreads #LinenJacket #SustainableStyle',
    mediaUrls: ['https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'scheduled',
    scheduledTime: 'Monday at 11:00 AM',
    createdAt: '2026-09-23T07:00:00Z',
    author: { id: 'usr-mia', name: 'Mia Chen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Scheduled',
    comments: [],
    auditLog: [{ id: 'a-14', action: 'Scheduled directly', user: 'Mia Chen', timestamp: 'Today at 7:00 AM' }]
  },
  // ── Nova Smart Tech posts ──
  {
    id: 'post-10',
    brandId: 'brand-nova',
    platforms: ['instagram', 'linkedin', 'youtube'],
    content: 'Introducing Nova AX-7 Pro wireless earbuds — 40hr battery, adaptive noise cancellation, studio-grade drivers. The future of audio is here. 🎵🔇 #NovaAX7 #AudioTech #WirelessEarbuds #NovaSmart',
    mediaUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'published',
    publishedTime: 'Sep 21 at 10:00 AM',
    createdAt: '2026-09-20T14:00:00Z',
    author: { id: 'usr-omar', name: 'Omar Khalid', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Published',
    comments: [],
    auditLog: [{ id: 'a-15', action: 'Published to 3 platforms', user: 'Omar Khalid', timestamp: 'Sep 21 at 10:00 AM' }],
    metrics: { likes: 1840, comments: 210, shares: 138, reach: 28400, impressions: 41200 }
  },
  {
    id: 'post-11',
    brandId: 'brand-nova',
    platforms: ['linkedin', 'youtube'],
    content: 'Nova SmartHome Hub v3 — control your entire ecosystem from one device. AI-powered routines, works with 500+ smart home brands. Pre-order now. 🏠🤖 #SmartHome #NovaHub #HomeAutomation',
    mediaUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'draft',
    createdAt: '2026-09-23T11:00:00Z',
    author: { id: 'usr-omar', name: 'Omar Khalid', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Draft',
    comments: [],
    auditLog: [{ id: 'a-16', action: 'Draft saved', user: 'Omar Khalid', timestamp: 'Today at 11:00 AM' }]
  },
  // ── WellNest Health posts ──
  {
    id: 'post-12',
    brandId: 'brand-wellnest',
    platforms: ['instagram', 'facebook', 'youtube'],
    content: '5 evidence-based morning habits that will transform your energy levels. No supplements, no biohacks — just science. 🌅🧘 Watch the full video on YouTube. #MorningRoutine #WellNest #HealthTips #Wellness',
    mediaUrls: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'published',
    publishedTime: 'Today at 7:00 AM',
    createdAt: '2026-09-22T18:00:00Z',
    author: { id: 'usr-fatima', name: 'Fatima Al-Hassan', avatar: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=100&auto=format&fit=crop&q=80', role: 'Manager' },
    approvalStage: 'Published',
    comments: [],
    auditLog: [{ id: 'a-17', action: 'Published to 3 platforms', user: 'Fatima Al-Hassan', timestamp: 'Today at 7:00 AM' }],
    metrics: { likes: 3100, comments: 280, shares: 190, reach: 48000, impressions: 72000 }
  },
  {
    id: 'post-13',
    brandId: 'brand-wellnest',
    platforms: ['instagram', 'facebook'],
    content: 'Your gut health shapes everything — mood, immunity, energy. Our new 30-day Gut Reset Program is now available. Early access for our community this week. 🌿💚 #GutHealth #WellNest #Microbiome #HolisticHealth',
    mediaUrls: ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    status: 'pending',
    scheduledTime: 'Thursday at 8:00 AM',
    createdAt: '2026-09-23T10:00:00Z',
    author: { id: 'usr-liam', name: 'Liam Foster', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80', role: 'Editor' },
    approvalStage: 'Manager Review',
    comments: [],
    auditLog: [
      { id: 'a-18', action: 'Created post', user: 'Liam Foster', timestamp: 'Today at 10:00 AM' },
      { id: 'a-19', action: 'Submitted for review', user: 'Liam Foster', timestamp: 'Today at 10:30 AM' }
    ]
  }
];

// ============================================================
// MEDIA ITEMS — isolated per Brand (brandId)
// ============================================================
export const initialMediaItems: MediaItem[] = [
  { id: 'med-1', brandId: 'brand-restaurant', name: 'autumn-squash-veloute.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 2400000, dimensions: '4096 x 3072', folder: 'Food Photography', tags: ['food', 'soup', 'seasonal'], usedCount: 2, uploadedAt: 'Sep 22' },
  { id: 'med-2', brandId: 'brand-restaurant', name: 'sunrise-valley-farm.jpg', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 3100000, dimensions: '5472 x 3648', folder: 'Behind the Scenes', tags: ['farm', 'organic', 'supplier'], usedCount: 1, uploadedAt: 'Sep 21' },
  { id: 'med-3', brandId: 'brand-restaurant', name: 'brunch-eggs-benedict.jpg', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 2800000, dimensions: '4000 x 2667', folder: 'Food Photography', tags: ['brunch', 'eggs', 'weekend'], usedCount: 1, uploadedAt: 'Sep 23' },
  { id: 'med-4', brandId: 'brand-restaurant', name: 'wild-salmon-risotto.jpg', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 2200000, dimensions: '3840 x 2560', folder: 'Food Photography', tags: ['salmon', 'dinner', 'chef'], usedCount: 3, uploadedAt: 'Sep 19' },
  { id: 'med-5', brandId: 'brand-restaurant', name: 'butter-basting-reel.mp4', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80', type: 'video', sizeBytes: 48000000, duration: '0:57', folder: 'Recipe Videos', tags: ['reel', 'cooking', 'technique'], usedCount: 1, uploadedAt: 'Sep 23' },
  { id: 'med-6', brandId: 'brand-urban', name: 'autumn-collection-lookbook.jpg', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 3400000, dimensions: '5000 x 3333', folder: 'Lookbook', tags: ['fashion', 'autumn', 'lookbook'], usedCount: 2, uploadedAt: 'Sep 22' },
  { id: 'med-7', brandId: 'brand-urban', name: 'jaipur-production.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 2600000, dimensions: '4096 x 2731', folder: 'Behind the Scenes', tags: ['ethical', 'production', 'india'], usedCount: 1, uploadedAt: 'Sep 23' },
  { id: 'med-8', brandId: 'brand-nova', name: 'nova-ax7-earbuds.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 1800000, dimensions: '3840 x 2160', folder: 'Product Shots', tags: ['earbuds', 'audio', 'product'], usedCount: 3, uploadedAt: 'Sep 20' },
  { id: 'med-9', brandId: 'brand-wellnest', name: 'morning-wellness-hero.jpg', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80', type: 'image', sizeBytes: 2900000, dimensions: '4928 x 3280', folder: 'Lifestyle', tags: ['wellness', 'morning', 'yoga'], usedCount: 2, uploadedAt: 'Sep 22' }
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const initialNotifications: NotificationItem[] = [
  { id: 'notif-1', type: 'approval_request', title: 'New post awaiting review', message: 'David Kumar submitted "Weekend Brunch Announcement" for Manager Review.', time: '45 mins ago', read: false },
  { id: 'notif-2', type: 'publish_success', title: 'Post published successfully', message: '"Behind the scenes at Sunrise Valley Farm" was published to Instagram, Facebook & LinkedIn.', time: '2 hours ago', read: false },
  { id: 'notif-3', type: 'token_expiring', title: 'TikTok token expiring soon', message: 'GreenLeaf Restaurant\'s TikTok authentication token expires in 48 hours.', time: '3 hours ago', read: false },
  { id: 'notif-4', type: 'publish_fail', title: 'Publishing failed', message: 'The butter basting video failed to publish to TikTok due to an API rate limit.', time: '6 hours ago', read: true },
  { id: 'notif-5', type: 'team_invite', title: 'Team invitation accepted', message: 'Priya Sharma accepted their invitation and joined GreenLeaf Restaurant as Analyst.', time: 'Yesterday', read: true },
  { id: 'notif-6', type: 'approval_done', title: 'Post approved', message: 'Sarah Lee approved "Chef Julian\'s autumn squash velouté" and moved it to the schedule.', time: 'Yesterday', read: true }
];

// ============================================================
// PUBLISHING LOGS
// ============================================================
export const initialPublishingLogs: PublishingLogItem[] = [
  { id: 'log-1', postId: 'post-2', postCaption: 'Behind the scenes with our local organic produce suppliers...', platform: 'instagram', status: 'success', timestamp: 'Today at 11:15 AM', attempts: 1 },
  { id: 'log-2', postId: 'post-2', postCaption: 'Behind the scenes with our local organic produce suppliers...', platform: 'facebook', status: 'success', timestamp: 'Today at 11:15 AM', attempts: 1 },
  { id: 'log-3', postId: 'post-2', postCaption: 'Behind the scenes with our local organic produce suppliers...', platform: 'linkedin', status: 'success', timestamp: 'Today at 11:16 AM', attempts: 1 },
  { id: 'log-4', postId: 'post-6', postCaption: 'Master the perfect French butter basting technique...', platform: 'tiktok', status: 'failed', timestamp: 'Today at 6:03 AM', error: 'Rate limit exceeded during video upload chunk transfer.', attempts: 3 },
  { id: 'log-5', postId: 'post-6', postCaption: 'Master the perfect French butter basting technique...', platform: 'youtube', status: 'success', timestamp: 'Today at 6:02 AM', attempts: 1 },
  { id: 'log-6', postId: 'post-5', postCaption: 'Crispy pan-seared wild king salmon...', platform: 'instagram', status: 'success', timestamp: 'Sep 20 at 7:00 PM', attempts: 1 }
];

// ============================================================
// DASHBOARD METRICS MAP — per brand, per date range
// ============================================================
export const dashboardMetricsMap: Record<string, Record<string, import('../types').DashboardMetricSummary>> = {
  'brand-restaurant': {
    'today': { connectedAccounts: 5, publishedPosts: 1, scheduledPosts: 2, failedPosts: 0, followers: 61550, followerGrowth: 1.2, engagement: 1240, reach: 18400, impressions: 24900, engagementRate: 5.2 },
    'yesterday': { connectedAccounts: 5, publishedPosts: 2, scheduledPosts: 1, failedPosts: 0, followers: 61350, followerGrowth: 0.9, engagement: 980, reach: 14200, impressions: 19800, engagementRate: 4.9 },
    '7days': { connectedAccounts: 5, publishedPosts: 8, scheduledPosts: 3, failedPosts: 1, followers: 61550, followerGrowth: 4.2, engagement: 6800, reach: 94000, impressions: 138000, engagementRate: 5.1 },
    '30days': { connectedAccounts: 5, publishedPosts: 28, scheduledPosts: 3, failedPosts: 1, followers: 61550, followerGrowth: 8.4, engagement: 24600, reach: 380000, impressions: 520000, engagementRate: 5.2 },
    '90days': { connectedAccounts: 5, publishedPosts: 94, scheduledPosts: 3, failedPosts: 2, followers: 61550, followerGrowth: 18.6, engagement: 72000, reach: 1100000, impressions: 1600000, engagementRate: 5.0 },
    'custom': { connectedAccounts: 5, publishedPosts: 28, scheduledPosts: 3, failedPosts: 1, followers: 61550, followerGrowth: 8.4, engagement: 24600, reach: 380000, impressions: 520000, engagementRate: 5.2 },
  },
  'brand-urban': {
    'today': { connectedAccounts: 4, publishedPosts: 0, scheduledPosts: 1, failedPosts: 0, followers: 78400, followerGrowth: 0.8, engagement: 890, reach: 14200, impressions: 19600, engagementRate: 4.8 },
    'yesterday': { connectedAccounts: 4, publishedPosts: 1, scheduledPosts: 0, failedPosts: 0, followers: 78300, followerGrowth: 0.6, engagement: 720, reach: 11400, impressions: 16200, engagementRate: 4.6 },
    '7days': { connectedAccounts: 4, publishedPosts: 6, scheduledPosts: 2, failedPosts: 0, followers: 78400, followerGrowth: 3.8, engagement: 5200, reach: 82000, impressions: 112000, engagementRate: 4.9 },
    '30days': { connectedAccounts: 4, publishedPosts: 22, scheduledPosts: 2, failedPosts: 0, followers: 78400, followerGrowth: 11.2, engagement: 19400, reach: 310000, impressions: 428000, engagementRate: 4.8 },
    '90days': { connectedAccounts: 4, publishedPosts: 76, scheduledPosts: 2, failedPosts: 1, followers: 78400, followerGrowth: 24.1, engagement: 58000, reach: 920000, impressions: 1280000, engagementRate: 4.7 },
    'custom': { connectedAccounts: 4, publishedPosts: 22, scheduledPosts: 2, failedPosts: 0, followers: 78400, followerGrowth: 11.2, engagement: 19400, reach: 310000, impressions: 428000, engagementRate: 4.8 },
  },
  'brand-nova': {
    'today': { connectedAccounts: 3, publishedPosts: 0, scheduledPosts: 0, failedPosts: 0, followers: 33640, followerGrowth: 0.5, engagement: 420, reach: 6800, impressions: 9400, engagementRate: 3.7 },
    'yesterday': { connectedAccounts: 3, publishedPosts: 1, scheduledPosts: 0, failedPosts: 0, followers: 33600, followerGrowth: 0.4, engagement: 380, reach: 6200, impressions: 8800, engagementRate: 3.6 },
    '7days': { connectedAccounts: 3, publishedPosts: 4, scheduledPosts: 0, failedPosts: 0, followers: 33640, followerGrowth: 2.8, engagement: 2800, reach: 44000, impressions: 62000, engagementRate: 3.8 },
    '30days': { connectedAccounts: 3, publishedPosts: 14, scheduledPosts: 0, failedPosts: 0, followers: 33640, followerGrowth: 9.4, engagement: 9600, reach: 152000, impressions: 214000, engagementRate: 3.7 },
    '90days': { connectedAccounts: 3, publishedPosts: 48, scheduledPosts: 0, failedPosts: 0, followers: 33640, followerGrowth: 22.8, engagement: 29000, reach: 468000, impressions: 660000, engagementRate: 3.6 },
    'custom': { connectedAccounts: 3, publishedPosts: 14, scheduledPosts: 0, failedPosts: 0, followers: 33640, followerGrowth: 9.4, engagement: 9600, reach: 152000, impressions: 214000, engagementRate: 3.7 },
  },
  'brand-wellnest': {
    'today': { connectedAccounts: 3, publishedPosts: 1, scheduledPosts: 0, failedPosts: 0, followers: 54900, followerGrowth: 1.4, engagement: 3100, reach: 48000, impressions: 72000, engagementRate: 6.4 },
    'yesterday': { connectedAccounts: 3, publishedPosts: 0, scheduledPosts: 1, failedPosts: 0, followers: 54800, followerGrowth: 1.1, engagement: 2400, reach: 38000, impressions: 57000, engagementRate: 6.2 },
    '7days': { connectedAccounts: 3, publishedPosts: 5, scheduledPosts: 1, failedPosts: 0, followers: 54900, followerGrowth: 5.6, engagement: 14800, reach: 228000, impressions: 342000, engagementRate: 6.3 },
    '30days': { connectedAccounts: 3, publishedPosts: 18, scheduledPosts: 1, failedPosts: 0, followers: 54900, followerGrowth: 14.8, engagement: 52000, reach: 820000, impressions: 1240000, engagementRate: 6.4 },
    '90days': { connectedAccounts: 3, publishedPosts: 62, scheduledPosts: 1, failedPosts: 0, followers: 54900, followerGrowth: 31.2, engagement: 158000, reach: 2400000, impressions: 3600000, engagementRate: 6.2 },
    'custom': { connectedAccounts: 3, publishedPosts: 18, scheduledPosts: 1, failedPosts: 0, followers: 54900, followerGrowth: 14.8, engagement: 52000, reach: 820000, impressions: 1240000, engagementRate: 6.4 },
  },
  'brand-xyz-quantum': {
    'today': { connectedAccounts: 2, publishedPosts: 1, scheduledPosts: 2, failedPosts: 0, followers: 21000, followerGrowth: 1.5, engagement: 820, reach: 12400, impressions: 26000, engagementRate: 4.9 },
    'yesterday': { connectedAccounts: 2, publishedPosts: 1, scheduledPosts: 1, failedPosts: 0, followers: 20900, followerGrowth: 1.1, engagement: 740, reach: 11200, impressions: 22000, engagementRate: 4.8 },
    '7days': { connectedAccounts: 2, publishedPosts: 6, scheduledPosts: 2, failedPosts: 0, followers: 21000, followerGrowth: 3.4, engagement: 4200, reach: 58000, impressions: 115000, engagementRate: 4.9 },
    '30days': { connectedAccounts: 2, publishedPosts: 18, scheduledPosts: 2, failedPosts: 0, followers: 21000, followerGrowth: 9.8, engagement: 16400, reach: 240000, impressions: 450000, engagementRate: 4.9 },
    '90days': { connectedAccounts: 2, publishedPosts: 45, scheduledPosts: 2, failedPosts: 1, followers: 21000, followerGrowth: 21.0, engagement: 44000, reach: 680000, impressions: 1200000, engagementRate: 4.8 },
    'custom': { connectedAccounts: 2, publishedPosts: 18, scheduledPosts: 2, failedPosts: 0, followers: 21000, followerGrowth: 9.8, engagement: 16400, reach: 240000, impressions: 450000, engagementRate: 4.9 },
  },
  'brand-apex-peak': {
    'today': { connectedAccounts: 2, publishedPosts: 2, scheduledPosts: 1, failedPosts: 0, followers: 58000, followerGrowth: 2.1, engagement: 3400, reach: 45000, impressions: 92000, engagementRate: 6.8 },
    'yesterday': { connectedAccounts: 2, publishedPosts: 1, scheduledPosts: 2, failedPosts: 0, followers: 57800, followerGrowth: 1.8, engagement: 2900, reach: 38000, impressions: 78000, engagementRate: 6.5 },
    '7days': { connectedAccounts: 2, publishedPosts: 12, scheduledPosts: 3, failedPosts: 0, followers: 58000, followerGrowth: 5.2, engagement: 18000, reach: 220000, impressions: 480000, engagementRate: 6.9 },
    '30days': { connectedAccounts: 2, publishedPosts: 34, scheduledPosts: 3, failedPosts: 0, followers: 58000, followerGrowth: 16.4, engagement: 68000, reach: 890000, impressions: 1850000, engagementRate: 6.8 },
    '90days': { connectedAccounts: 2, publishedPosts: 85, scheduledPosts: 3, failedPosts: 1, followers: 58000, followerGrowth: 38.0, engagement: 190000, reach: 2400000, impressions: 4800000, engagementRate: 6.7 },
    'custom': { connectedAccounts: 2, publishedPosts: 34, scheduledPosts: 3, failedPosts: 0, followers: 58000, followerGrowth: 16.4, engagement: 68000, reach: 890000, impressions: 1850000, engagementRate: 6.8 },
  }
};

// ============================================================
// MULTI-TENANT MEMBERSHIPS & INVITATIONS
// ============================================================

export const initialUserMemberships: import('../types').UserOrganizationMembership[] = [
  // Alex Morgan belongs to 3 organizations with different roles!
  {
    userId: 'usr-alex',
    organizationId: 'org-acme',
    role: 'Admin', // Admin in Acme Digital Agency
    accessibleBrandIds: ['brand-restaurant', 'brand-urban', 'brand-nova', 'brand-wellnest'],
    joinedAt: '2025-01-10'
  },
  {
    userId: 'usr-alex',
    organizationId: 'org-xyz',
    role: 'Manager', // Manager in XYZ Marketing Group
    accessibleBrandIds: ['brand-xyz-quantum', 'brand-xyz-sunrise'],
    joinedAt: '2025-06-15'
  },
  {
    userId: 'usr-alex',
    organizationId: 'org-apex',
    role: 'Client', // Client in Apex Growth Media
    accessibleBrandIds: ['brand-apex-peak'],
    joinedAt: '2025-09-01'
  },
  // Priya Sharma
  {
    userId: 'usr-priya',
    organizationId: 'org-acme',
    role: 'Editor',
    accessibleBrandIds: ['brand-restaurant', 'brand-urban'],
    joinedAt: '2025-03-20'
  },
  // Rahul
  {
    userId: 'usr-rahul',
    organizationId: 'org-acme',
    role: 'Analyst',
    accessibleBrandIds: ['brand-restaurant'],
    joinedAt: '2025-05-12'
  }
];

export const initialInvitations: import('../types').MemberInvitation[] = [
  {
    id: 'inv-1',
    token: 'inv-tok-greenleaf-sarah-892',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    organizationId: 'org-acme',
    brandIds: ['brand-restaurant'],
    role: 'Editor',
    status: 'pending',
    invitedBy: 'Alex Morgan',
    createdAt: '2026-09-24T10:30:00Z',
    expiresAt: '2026-10-01T10:30:00Z'
  },
  {
    id: 'inv-2',
    token: 'inv-tok-urban-claire-441',
    name: 'Claire Bennett',
    email: 'claire@designhub.co',
    organizationId: 'org-acme',
    brandIds: ['brand-urban', 'brand-wellnest'],
    role: 'Contributor',
    status: 'pending',
    invitedBy: 'Alex Morgan',
    createdAt: '2026-09-25T14:15:00Z',
    expiresAt: '2026-10-02T14:15:00Z'
  },
  {
    id: 'inv-3',
    token: 'inv-tok-xyz-muthu-773',
    name: 'Muthu Krishnan',
    email: 'muthu@xyzmarketing.io',
    organizationId: 'org-xyz',
    brandIds: ['brand-xyz-quantum'],
    role: 'Manager',
    status: 'pending',
    invitedBy: 'Arun Kumar',
    createdAt: '2026-09-22T08:00:00Z',
    expiresAt: '2026-09-29T08:00:00Z'
  }
];
