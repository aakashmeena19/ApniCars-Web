// Sidebar.tsx
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface ChildItem {
  label: string;
  href: string;
}

interface NavItemType {
  label: string;
  href?: string;
  badge?: string;
  icon: React.ReactNode;
  children?: ChildItem[];
}

interface NavGroup {
  group: string;
  items: NavItemType[];
}

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
}

interface SidebarProps {
  collapsed: boolean;
}

const NAV: NavGroup[] = [
  {
    group: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Management",
    items: [
       {
        label: "Admin Users",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
        children: [
          { label: "All Admins", href: "/admins" },
          { label: "Permissions", href: "/permissions" },
          { label: "Roles", href: "/roles" },
          { label: "Admin Logs", href: "/adminlogs" },
        ],
      },
      {
        label: "Users",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
        children: [
          { label: "All Users", href: "/users" },
        ],
      },
      {
        label: "Ads",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
        children: [
          { label: "Advertisers", href: "/ads/advertisers" },
          { label: "Placements", href: "/ads/placements" },
          { label: "Campaigns", href: "/ads/campaigns" },
          { label: "Clicks", href: "/ads/clicks" },
          { label: "Impressions", href: "/ads/impressions" },

        ],
      },
    ],
  },
  {
    group: "Inventory",
    items: [
      {
        label: "New Cars",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18.5 10.5H5.5L3 15H21L18.5 10.5Z" strokeLinejoin="round" />
            <circle cx="7" cy="17.5" r="1.5" />
            <circle cx="17" cy="17.5" r="1.5" />
            <path d="M5.5 10.5L7.5 6H16.5L18.5 10.5" strokeLinejoin="round" />
          </svg>
        ),
        children: [
          { label: "Brands", href: "/new-cars/brands" },
          { label: "Car Models", href: "/new-cars/models" },
          { label: "Body Types", href: "/new-cars/body-types" },
          { label: "Attribute Options", href: "/new-cars/attribute-options" },
          { label: "Variants", href: "/new-cars/variants" },
          { label: "Powertrains Electric", href: "/new-cars/powertrain-eletric" },
          { label: "Powertrains Ice", href: "/new-cars/powertrain-ice" },
          { label: "Colors & Images", href: "/new-cars/colors" },
          { label: "Feature Categories", href: "/new-cars/feature-categories" },
          { label: "Features", href: "/new-cars/features" },
          { label: "Variant Features", href: "/new-cars/variant-features" },
          { label: "FAQs", href: "/new-cars/faqs" },
        ],
      },
      {
        label: "Used Cars",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        ),
        children: [
          { label: "Listings", href: "/used-cars/listings" },
          { label: "Inspections", href: "/used-cars/inspections" },
        ],
      },
    ],
  },
  {
    group: "Leads",
    items: [
      {
        label: "Buy Leads",
        badge: "24",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
        children: [
          { label: "New Car Leads", href: "/leads/buy/new-cars" },
          { label: "Insurance Leads", href: "/leads/buy/insurance" },
          { label: "Loan Leads", href: "/leads/buy/loan" },
          { label: "Soft Leads", href: "/leads/buy/soft" },
          { label: "Price Drop Alerts", href: "/leads/buy/price-drop" },
          { label: "Launch Notify", href: "/leads/buy/launch-notify" },
        ],
      },
      {
        label: "Sell Leads",
        badge: "8",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
        children: [
          { label: "All Sell Leads", href: "/leads/sell" },
          { label: "Lead Activities", href: "/leads/sell/activities" },
        ],
      },
    ],
  },
  {
    group: "Partners",
    items: [
      {
        label: "Lenders",
        href: "/partners/lenders",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="10" width="16" height="9" rx="1" />
            <path d="M2 10h20L12 4 2 10Z" strokeLinejoin="round" />
            <line x1="8" y1="13" x2="8" y2="16" />
            <line x1="12" y1="13" x2="12" y2="16" />
            <line x1="16" y1="13" x2="16" y2="16" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
      label: "Home Page",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      children: [
        { label: "Banners", href: "/home/banners" },
        { label: "Testimonials", href: "/home/testimonials" },
      ],
    },
      {
        label: "News",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
        children: [
          { label: "Category", href: "/news/category" },
          { label: "All News", href: "/news/all-news" },
        ],
      },
      {
        label: "Reviews",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        children: [
          { label: "All Reviews", href: "/reviews/all-reviews" },
        ],
      },
    ],
  },
  {
    group: "Analytics",
    items: [
      {
        label: "Analytics",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
        children: [
          { label: "Page Views", href: "/analytics/page-views" },
          { label: "Search Logs", href: "/analytics/search-logs" },
        ],
      },
    ],
  },
  {
    group: "SEO & Config",
    items: [
      {
        label: "SEO",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
        children: [
          { label: "Meta Tags", href: "/seo/meta" },
          { label: "Redirects", href: "/seo/redirects" },
        ],
      },
      {
        label: "Locations",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
        children: [
          { label: "Countries", href: "/countries" },
          { label: "States", href: "/states" },
          { label: "Cities", href: "/cities" },
        ],
      },
      {
        label: "Settings",
        href: "/settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

function NavItem({ item, collapsed }: NavItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = item.children && item.children.length > 0;

  // Check if this item or any child is active
  const isActive = item.href
    ? location.pathname === item.href
    : item.children?.some((c) => location.pathname === c.href) ?? false;

  const handleClick = () => {
    if (!collapsed && hasChildren) {
      setOpen((v) => !v);
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const showFlyout = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverOpen(true);
  };

  const hideFlyout = () => {
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={collapsed ? showFlyout : undefined}
      onMouseLeave={collapsed ? hideFlyout : undefined}
    >
      <button
        onClick={handleClick}
        className={`cursor-pointer w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150
          ${isActive
            ? "text-white font-semibold shadow-sm"
            : "text-[#50655f] hover:text-[#0b5a48] hover:bg-[#eff7f3] font-medium"
          }`}
        style={isActive ? { background: "linear-gradient(135deg, #08483a 0%, #0c725a 100%)", boxShadow: "0 8px 18px rgba(11, 90, 72, 0.18)" } : {}}
      >
        <span className="shrink-0">{item.icon}</span>

        {!collapsed && (
          <>
            <span className="flex-1 text-[12.5px] truncate">{item.label}</span>
            {item.badge && (
              <span
                className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={{ background: "#c9f24a", color: "#17382f" }}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <svg
                width="10" height="10" viewBox="0 0 12 8" fill="none"
                className="text-[#96a6a1] transition-transform duration-200 shrink-0"
                style={{ transform: open ? "rotate(180deg)" : "none" }}
              >
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </>
        )}
      </button>

      {/* Collapsed hover flyout */}
      {collapsed && hoverOpen && (
        <div
          className="absolute left-full top-0 ml-2 z-50"
          onMouseEnter={showFlyout}
          onMouseLeave={hideFlyout}
        >
          <div className="bg-white border border-[#dce7e3] rounded-lg shadow-xl overflow-hidden min-w-[180px]">
            <div
              className="px-3 py-2 text-[11px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #08483a 0%, #0c725a 100%)" }}
            >
              {item.label}
            </div>
            {hasChildren ? (
              item.children!.map((child) => (
                <button
                  key={child.label}
                  onClick={() => { navigate(child.href); setHoverOpen(false); }}
                  className="cursor-pointer w-full block text-left px-3 py-2 text-[12px] text-[#304942] hover:bg-[#eff7f3] hover:text-[#0b5a48] transition-colors"
                >
                  {child.label}
                </button>
              ))
            ) : (
              <button
                onClick={() => { if (item.href) navigate(item.href); setHoverOpen(false); }}
                className="cursor-pointer w-full text-left px-3 py-2 text-[12px] text-[#304942] hover:bg-[#f3f7f5]"
              >
                Open
              </button>
            )}
          </div>
          <div
            className="absolute left-0 top-3 -translate-x-1.5 border-4 border-transparent border-r-white"
            style={{ filter: "drop-shadow(-1px 0 0 #dce7e3)" }}
          />
        </div>
      )}

      {/* Expanded children */}
      {hasChildren && !collapsed && open && (
        <div className="ml-[26px] mt-1 border-l border-[#dce7e3] pl-3 space-y-0.5 pb-1">
          {item.children!.map((child) => {
            const childActive = location.pathname === child.href;
            return (
              <button
                key={child.label}
                onClick={() => navigate(child.href)}
                className={`cursor-pointer w-full flex items-center gap-1.5 px-2 py-1.5 text-[12px] rounded-lg transition-colors duration-150
                  ${childActive
                    ? "text-[#0b5a48] bg-[#eaf5f0] font-semibold"
                    : "text-[#71827d] hover:text-[#0b5a48] hover:bg-[#eff7f3]"
                  }`}
              >
                <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <aside
      className="admin-sidebar h-full border-r flex flex-col transition-all duration-300 overflow-visible shrink-0 relative"
      style={{ width: collapsed ? "56px" : "236px" }}
    >
      <nav className="flex-1 overflow-y-auto overflow-x-visible py-4 px-2 space-y-4 scrollbar-thin">
        {NAV.map((group) => (
          <div key={group.group}>
            {!collapsed ? (
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#96a6a1] px-2.5 mb-2">
                {group.group}
              </p>
            ) : (
              <div className="h-px bg-[#e8efec] mx-2 mb-2" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.label} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#dce7e3] p-2">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="cursor-pointer w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#71827d] hover:text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-60"
          title={collapsed ? "Logout" : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && (
            <span className="text-[12.5px] font-medium">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
