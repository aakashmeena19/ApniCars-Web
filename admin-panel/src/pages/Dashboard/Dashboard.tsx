// src/pages/Dashboard/Dashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDashboardSummaryQuery, POLL_INTERVAL_MS, type LeadTypeKey } from "./dashboard.api";
import { extractApiError } from "../../lib/apiClient";
import { formatRelativeToNow } from "../../lib/timeAgo";
import { getSeoPageTypeLabel, STATIC_PAGE_SLUG_OPTIONS } from "../../lib/lookups";
import AdminPageHeader from "../../components/common/AdminPageHeader";

const ACCENT = "#0B5A48";

const LEAD_TYPE_LABELS: Record<LeadTypeKey, string> = {
  sellCar: "Sell Car",
  buyNewCar: "Buy New Car",
  buyUsedCar: "Buy Used Car",
  insurance: "Insurance",
  loan: "Loan",
  softLead: "Calculator (Soft)",
  priceDropAlert: "Price Drop Alert",
};

function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="admin-surface bg-[linear-gradient(145deg,#ffffff_35%,#edf7f2_100%)] p-4 flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#71827d]">{label}</span>
      <p className="admin-display text-2xl text-[#16322c] leading-none">{value}</p>
      {sub && <p className={`text-[11px] font-medium ${positive ? "text-emerald-600" : "text-[#71827d]"}`}>{sub}</p>}
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="admin-display text-[14px] text-[#16322c]">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// 30-bar trend chart, no charting library — thin rounded data-ends, a
// hover tooltip per bar, values only shown on hover. Same component as
// Ai/Dashboard/Dashboard.tsx's TrendChart (kept local rather than shared
// since the two callers' tooltip copy differs — "leads" vs "generated" —
// and duplicating ~35 lines of JSX twice is cheaper than a prop-heavy
// abstraction for just two call sites). A third caller (traffic) tipped
// that calculus, so the tooltip noun is now a prop instead of a third copy.
function TrendChart({ trend, unitLabel = "lead" }: { trend: { date: string; count: number }[]; unitLabel?: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const max = Math.max(1, ...trend.map((t) => t.count));
  const labelEvery = trend.length > 14 ? 5 : 1;

  return (
    <div className="flex items-end gap-[3px] h-[100px] px-1">
      {trend.map((point, i) => {
        const heightPct = Math.max(3, (point.count / max) * 100);
        const isToday = i === trend.length - 1;
        const showLabel = isToday || i % labelEvery === 0;
        const dateObj = new Date(point.date + "T00:00:00");
        const dayLabel = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const fullLabel = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        return (
          <div
            key={point.date}
            className="relative flex-1 flex flex-col items-center justify-end h-full min-w-0"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
          >
            {hoverIdx === i && (
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white px-2 py-1 rounded-md whitespace-nowrap z-10"
                style={{ background: "#16322c" }}
              >
                {point.count} {unitLabel}{point.count === 1 ? "" : "s"}
                <span className="block text-[9px] font-medium text-white/70">{fullLabel}</span>
              </div>
            )}
            <div
              className="w-full rounded-t-[3px] transition-all duration-300"
              style={{
                height: `${heightPct}%`,
                background: isToday ? ACCENT : "#f0c4b8",
                opacity: hoverIdx === null || hoverIdx === i ? 1 : 0.55,
              }}
            />
            <span
              className={`text-[9px] mt-1.5 font-semibold whitespace-nowrap ${isToday ? "text-[#16322c]" : "text-[#71827d]"} ${showLabel ? "" : "opacity-0"}`}
            >
              {dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, error } = useGetDashboardSummaryQuery(undefined, {
    pollingInterval: POLL_INTERVAL_MS,
  });

  if (isLoading) {
    return <div className="py-20 text-center text-[13px] text-[#71827d]">Loading dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
        <p className="text-red-500 text-xs font-medium">{error ? extractApiError(error) : "No data available."}</p>
      </div>
    );
  }

  const { kpis, leads, traffic, content, ads, seo, recentActivity, pendingActions } = data;
  const staticTotal = STATIC_PAGE_SLUG_OPTIONS.length;

  return (
    <div className="space-y-5 pb-10 max-w-[1440px] mx-auto">
      <AdminPageHeader
        title="Dashboard"
        description={`Live business overview, refreshed every ${POLL_INTERVAL_MS / 1000}s${isFetching ? " - syncing..." : ""}`}
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Brands" value={`${kpis.totalBrands}`} />
        <StatCard label="Models" value={`${kpis.totalModels}`} />
        <StatCard label="Variants" value={`${kpis.totalVariants}`} />
        <StatCard label="Used Listings" value={`${kpis.totalUsedCarListings}`} />
        <StatCard label="Users" value={`${kpis.totalUsers}`} />
        <StatCard label="Admins" value={`${kpis.totalAdmins}`} />
      </div>

      {/* Leads */}
      <SectionCard
        title={`Leads — ${leads.total} total`}
        action={
          <button
            onClick={() => navigate("/leads/buy/new-cars")}
            className="cursor-pointer text-[11.5px] font-bold text-[#304942] hover:text-[#16322c]"
          >
            View all →
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
          {leads.byType.map((lt) => (
            <div key={lt.type} className="bg-[#f3f7f5] rounded-lg p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#71827d] mb-1">
                {LEAD_TYPE_LABELS[lt.type]}
              </p>
              <p className="text-lg font-black text-[#16322c] leading-none">{lt.count}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#304942]">Last 30 days</span>
        </div>
        <TrendChart trend={leads.trend} />
      </SectionCard>

      {/* Traffic */}
      <SectionCard
        title={`Traffic — ${traffic.total} total`}
        action={
          <button
            onClick={() => navigate("/analytics/page-views")}
            className="cursor-pointer text-[11.5px] font-bold text-[#304942] hover:text-[#16322c]"
          >
            View all →
          </button>
        }
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#304942]">Last 30 days</span>
        </div>
        <TrendChart trend={traffic.trend} unitLabel="view" />
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Content */}
        <SectionCard title="Content">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="News" value={`${content.totalNews}`} sub={`${content.publishedNews} published`} positive />
            <StatCard label="Drafts" value={`${content.draftNews}`} />
            <StatCard
              label="Reviews"
              value={`${content.totalReviews}`}
              sub={content.pendingReviews > 0 ? `${content.pendingReviews} pending` : "all moderated"}
              positive={content.pendingReviews === 0}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0ece4] flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#71827d]">Car FAQs</span>
            <span className="text-[13px] font-black text-[#16322c]">{content.totalFaqs}</span>
          </div>
        </SectionCard>

        {/* Ads */}
        <SectionCard
          title="Ads"
          action={
            <button
              onClick={() => navigate("/ads/campaigns")}
              className="cursor-pointer text-[11.5px] font-bold text-[#304942] hover:text-[#16322c]"
            >
              View all →
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Active Campaigns" value={`${ads.activeCampaigns}`} />
            <StatCard label="Active Placements" value={`${ads.activePlacements}`} />
            <StatCard label="Impressions Today" value={`${ads.impressionsToday}`} />
            <StatCard label="Clicks Today" value={`${ads.clicksToday}`} />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="SEO Coverage"
        action={
          <button
            onClick={() => navigate("/seo/meta")}
            className="cursor-pointer text-[11.5px] font-bold text-[#304942] hover:text-[#16322c]"
          >
            Manage -&gt;
          </button>
        }
      >
        <StatCard
          label="Static Pages"
          value={`${seo.staticCovered}/${staticTotal}`}
          sub={seo.staticCovered === staticTotal ? "fully covered" : `${staticTotal - seo.staticCovered} missing`}
          positive={seo.staticCovered === staticTotal}
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {seo.dynamicByType.map((d) => (
            <div key={d.pageType} className="bg-[#f3f7f5] rounded-lg p-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#304942]">{getSeoPageTypeLabel(d.pageType)}</span>
              <span className="text-[13px] font-black text-[#16322c]">{d.count}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Pending actions */}
      {pendingActions.reviewsPending > 0 && (
        <SectionCard title="Needs Your Attention">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/reviews/all-reviews")}
              className="cursor-pointer flex items-center gap-2 bg-[#fef2f0] hover:bg-[#fbe6e2] transition-colors rounded-lg px-3.5 py-2.5"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }} />
              <span className="text-[12px] font-bold text-[#16322c]">
                {pendingActions.reviewsPending} review{pendingActions.reviewsPending === 1 ? "" : "s"} pending
              </span>
            </button>
          </div>
        </SectionCard>
      )}

      {/* Recent activity */}
      <SectionCard title="Recent Activity">
        {recentActivity.length === 0 ? (
          <p className="text-[12px] text-[#71827d]">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-[#f0ece4]">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-[#16322c] truncate">{item.description ?? "—"}</p>
                  <p className="text-[11px] text-[#71827d]">{item.adminName}</p>
                </div>
                <span className="text-[10.5px] text-[#71827d] whitespace-nowrap shrink-0">
                  {formatRelativeToNow(item.createdAt, false)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
