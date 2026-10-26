import { useEffect, useState } from 'react';
import { useAuth } from '../context';
import { ImpactStatsCard, PersonalImpact, LeaderboardItem, EmptyDashboard } from '../components/dashboard/DashboardComponents';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { getChartData, getImpactHistory, getImpactStats, getLeaderboard } from '../services/impactService';
import { cn } from '../utils/formatters';
import { TrendingUp, Star, Clock, Download, ChevronDown, ChevronUp } from 'lucide-react';

const mockImpactStats = {
  totalBorrows: 0,
  itemsSaved: 0,
  co2Saved: 0,
  communityScore: 0,
  yourBorrows: 0,
  yourShares: 0,
  netContribution: 0
};

const mockChartData = {
  timeline: [],
  categoryDistribution: [],
  monthlyActivity: []
};

const mockLeaderboard = {
  topSharers: [
    { _id: '1', name: 'Arjun Patel', rollNumber: 'EC2021045', department: 'Electronics', year: 4, avatar: null, sharesCount: 24, borrowsCount: 5, score: 98 },
    { _id: '2', name: 'Priya Sharma', rollNumber: 'CS2021001', department: 'Computer Science', year: 3, avatar: null, sharesCount: 18, borrowsCount: 12, score: 87 },
    { _id: '3', name: 'Vikram Singh', rollNumber: 'EE2021089', department: 'Electrical', year: 4, avatar: null, sharesCount: 15, borrowsCount: 8, score: 82 },
    { _id: '4', name: 'Sneha Reddy', rollNumber: 'ME2022012', department: 'Mechanical', year: 2, avatar: null, sharesCount: 12, borrowsCount: 15, score: 75 },
    { _id: '5', name: 'Ananya Gupta', rollNumber: 'CS2021056', department: 'Computer Science', year: 3, avatar: null, sharesCount: 10, borrowsCount: 20, score: 70 }
  ],
  topBorrowers: [
    { _id: '6', name: 'Rohit Kumar', rollNumber: 'EE2022034', department: 'Electrical', year: 3, avatar: null, sharesCount: 3, borrowsCount: 28, score: 65 },
    { _id: '7', name: 'Meera Joshi', rollNumber: 'CE2021078', department: 'Civil', year: 4, avatar: null, sharesCount: 2, borrowsCount: 24, score: 58 },
    { _id: '8', name: 'Karan Malhotra', rollNumber: 'CH2022045', department: 'Chemical', year: 2, avatar: null, sharesCount: 1, borrowsCount: 22, score: 52 },
    { _id: '9', name: 'Deepika Singh', rollNumber: 'BT2021090', department: 'Biotechnology', year: 3, avatar: null, sharesCount: 4, borrowsCount: 19, score: 48 },
    { _id: '10', name: 'Aditya Verma', rollNumber: 'IT2022067', department: 'Information Technology', year: 2, avatar: null, sharesCount: 0, borrowsCount: 18, score: 42 }
  ]
};

const mockHistory = [
  { _id: '1', item: { _id: '1', title: 'Canon EOS R50 Camera', images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Cameras' }, borrower: { _id: '2', name: 'You', rollNumber: 'CS2021001' }, completedAt: '2024-02-15T10:00:00Z', estimatedValue: 45000 },
  { _id: '2', item: { _id: '2', title: 'Engineering Mathematics Textbook', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Books' }, borrower: { _id: '2', name: 'You', rollNumber: 'CS2021001' }, completedAt: '2024-02-10T14:00:00Z', estimatedValue: 1200 },
  { _id: '3', item: { _id: '3', title: 'TI-84 Plus CE Calculator', images: ['https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Calculators' }, borrower: { _id: '2', name: 'You', rollNumber: 'CS2021001' }, completedAt: '2024-01-28T09:00:00Z', estimatedValue: 8500 },
  { _id: '4', item: { _id: '4', title: 'Arduino Starter Kit', images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Project Equipment' }, borrower: { _id: '2', name: 'You', rollNumber: 'CS2021001' }, completedAt: '2024-01-20T11:00:00Z', estimatedValue: 3200 },
  { _id: '5', item: { _id: '5', title: 'Multimeter Fluke 117', images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Tools' }, borrower: { _id: '2', name: 'You', rollNumber: 'CS2021001' }, completedAt: '2024-01-15T16:00:00Z', estimatedValue: 12000 }
];

function ChartPlaceholder({ title, children, className }) {
  return (
    <Card className={cn('impact-chart-card', className)}>
      <h3 className="impact-chart-title">{title}</h3>
      <div className="impact-chart-body">
        {children}
      </div>
    </Card>
  );
}

function TimelineChart({ data }) {
  const points = Array.isArray(data) ? data : [];
  const maxCount = Math.max(1, ...points.map(d => Number(d.count) || 0));
  if (!points.length) return <p className="impact-chart-empty">No completed or active borrows to chart yet.</p>;
  return (
    <div className="impact-timeline-chart" role="img" aria-label="Borrowing activity over time">
      <div className="impact-chart-y-labels" aria-hidden="true"><span>{maxCount}</span><span>{Math.round(maxCount / 2)}</span><span>0</span></div>
      <div className="impact-timeline-plot" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
        <div className="impact-chart-gridlines" aria-hidden="true"><i /><i /><i /></div>
        {points.map((point) => {
          const value = Number(point.count) || 0;
          const label = /^\d{4}-\d{2}$/.test(point.date)
            ? new Date(`${point.date}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
            : point.date;
          return (
            <div key={point.date} className="impact-timeline-point">
              <div className="impact-bar-value">{value}</div>
              <div className="impact-timeline-bar" style={{ height: `${Math.max(3, (value / maxCount) * 100)}%` }} title={`${label}: ${value} borrows`} />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryDonutChart({ data }) {
  const points = Array.isArray(data) ? data.filter((d) => Number(d.count) > 0) : [];
  const total = points.reduce((sum, d) => sum + Number(d.count), 0);
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  let cumulative = 0;
  if (!total) return <p className="impact-chart-empty">No category data available yet.</p>;

  return (
    <div className="impact-donut-layout">
      <div className="impact-donut-wrap">
        <svg viewBox="0 0 100 100" role="img" aria-label={`Category distribution across ${total} items`}>
          {points.map((item, i) => {
            const percentage = (item.count / total) * 100;
            const start = cumulative;
            const end = cumulative + percentage;
            const largeArc = percentage > 50 ? 1 : 0;
            const startAngle = (start / 100) * 360;
            const endAngle = (end / 100) * 360;
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

            cumulative += percentage;
            return (
              <path
                key={item.category}
                d={`M50,50 L${x1},${y1} A40,40 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={colors[i % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="impact-donut-total"><strong>{total.toLocaleString()}</strong><span>items</span></div>
      </div>
      <div className="impact-donut-legend">
        {points.map((item, i) => (
          <div key={item.category} className="impact-donut-legend-item">
            <span className="impact-legend-dot" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="impact-legend-name">{item.category}</span>
            <span className="impact-legend-value">{Math.round((item.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyActivityChart({ data }) {
  const points = Array.isArray(data) ? data : [];
  const maxValue = Math.max(1, ...points.map(d => Math.max(Number(d.borrows) || 0, Number(d.listings) || 0)));
  if (!points.length) return <p className="impact-chart-empty">No monthly activity to chart yet.</p>;
  return (
    <div className="impact-monthly-chart" role="img" aria-label="Monthly completed borrows and new listings comparison">
      <div className="impact-chart-y-labels" aria-hidden="true"><span>{maxValue}</span><span>{Math.round(maxValue / 2)}</span><span>0</span></div>
      <div className="impact-monthly-plot" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
        <div className="impact-chart-gridlines" aria-hidden="true"><i /><i /><i /></div>
        {points.map((point) => (
          <div key={point.month} className="impact-month-column">
            <div className="impact-month-bars">
              <div className="impact-month-bar impact-month-bar-borrows" style={{ height: `${Math.max(0, (Number(point.borrows) || 0) / maxValue * 100)}%` }} title={`${point.month} borrows: ${point.borrows}`} />
              <div className="impact-month-bar impact-month-bar-shares" style={{ height: `${Math.max(0, (Number(point.listings) || 0) / maxValue * 100)}%` }} title={`${point.month} new listings: ${point.listings}`} />
            </div>
            <span>{point.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImpactDashboardPage() {
  const { user } = useAuth();
  const [liveStats, setLiveStats] = useState(mockImpactStats);
  const [chartData, setChartData] = useState(mockChartData);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [history, setHistory] = useState(mockHistory);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getImpactStats(), getChartData(), getLeaderboard(), getImpactHistory(1, 10)])
      .then(([nextStats, nextCharts, nextLeaderboard, nextHistory]) => {
        if (cancelled) return;
        setLiveStats(nextStats);
        setChartData(nextCharts);
        setLeaderboard(nextLeaderboard);
        setHistory(Array.isArray(nextHistory?.history) ? nextHistory.history : []);
        setDemoMode(false);
      })
      .catch(() => {
        if (!cancelled) setDemoMode(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?._id]);

  const handleExport = () => {
    const report = {
      user: user?.name,
      generatedAt: new Date().toISOString(),
      stats: liveStats,
      history
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borrowcircles-impact-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="impact-dashboard min-h-screen bg-gray-50">
      {demoMode && (
        <div className="container pt-4">
          <div className="alert alert-warning" role="status">
            Live impact data is unavailable. This page is showing sample preview data.
          </div>
        </div>
      )}
      {loading && <p className="sr-only" role="status">Loading live impact data</p>}
      <div className="impact-hero">
        <div className="container relative">
          <h1 className="impact-hero-title">Your Borrow Impact</h1>
          <p className="impact-hero-subtitle">
            Track how your sharing activity contributes to a more sustainable campus community.
            Every borrow saves resources and builds connections.
          </p>
          <div className="impact-stats">
            <div className="impact-stat">
            <div className="impact-stat-value">{liveStats.totalBorrows.toLocaleString()}</div>
              <div className="impact-stat-label">Total Community Borrows</div>
            </div>
            <div className="impact-stat">
            <div className="impact-stat-value">{liveStats.itemsSaved.toLocaleString()}</div>
              <div className="impact-stat-label">Items Saved from Purchase</div>
            </div>
            <div className="impact-stat">
            <div className="impact-stat-value">{liveStats.co2Saved.toLocaleString()} kg</div>
              <div className="impact-stat-label">CO₂ Estimated Saved</div>
            </div>
            <div className="impact-stat">
            <div className="impact-stat-value">{liveStats.communityScore}</div>
              <div className="impact-stat-label">Community Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <ImpactStatsCard stats={liveStats} />

        <PersonalImpact
          borrows={liveStats.yourBorrows}
          shares={liveStats.yourShares}
          netContribution={liveStats.netContribution}
        />

        <div className="impact-charts mt-8">
          <ChartPlaceholder title="Borrowed Over Time">
            <TimelineChart data={chartData.timeline} />
          </ChartPlaceholder>
          <ChartPlaceholder title="Category Distribution">
            <CategoryDonutChart data={chartData.categoryDistribution} />
          </ChartPlaceholder>
        </div>

        <ChartPlaceholder title="Monthly Activity" className="mt-6">
          <MonthlyActivityChart data={chartData.monthlyActivity} />
          <div className="impact-chart-legend">
            <span><i className="impact-legend-dot impact-month-bar-borrows" /> Borrows</span>
          <span><i className="impact-legend-dot impact-month-bar-shares" /> New listings</span>
          </div>
        </ChartPlaceholder>

        <div className="impact-personal mt-8">
          <h2 className="impact-personal-title">Your Personal Impact</h2>
          <div className="impact-personal-grid">
            <div className="impact-personal-item">
              <div className="impact-personal-value">{liveStats.yourBorrows}</div>
              <div className="impact-personal-label">Items Borrowed</div>
            </div>
            <div className="impact-personal-item">
              <div className="impact-personal-value">{liveStats.yourShares}</div>
              <div className="impact-personal-label">Items Shared</div>
            </div>
            <div className="impact-personal-item">
              <div className="impact-personal-value text-primary-600">{liveStats.yourBorrows + liveStats.yourShares}</div>
              <div className="impact-personal-label">Total Transactions</div>
            </div>
            <div className="impact-personal-item">
              <div className="impact-personal-value text-success-600">{liveStats.netContribution >= 0 ? '+' : ''}{liveStats.netContribution}</div>
              <div className="impact-personal-label">Net Contribution</div>
            </div>
          </div>
        </div>

        <div className="leaderboard mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="leaderboard-title">Community Leaderboard</h2>
            <Button variant="outline" size="sm" onClick={() => setShowLeaderboard(!showLeaderboard)} leftIcon={showLeaderboard ? <ChevronUp size={16} /> : <ChevronDown size={16} />}>
              {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </Button>
          </div>

          {showLeaderboard && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="text-warning-500" size={20} />
                  Top Sharers
                </h3>
                <div className="leaderboard-list">
                  {leaderboard.topSharers.map((entry, i) => (
                    <LeaderboardItem key={entry._id} entry={entry} rank={i + 1} type="sharers" />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="text-primary-500" size={20} />
                  Top Borrowers
                </h3>
                <div className="leaderboard-list">
                  {leaderboard.topBorrowers.map((entry, i) => (
                    <LeaderboardItem key={entry._id} entry={entry} rank={i + 1} type="borrowers" />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Borrowing History</h3>
            {history.length === 0 ? (
              <EmptyDashboard
                icon={<Clock size={48} className="text-gray-300" />}
                title="No completed borrows yet"
                message="Your completed borrowing transactions will appear here once items are returned."
                action={<Button as="a" href="/explore">Explore Items</Button>}
              />
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <Card key={item._id} className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={item.item.images?.[0]} alt={item.item.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.item.title}</p>
                        <p className="text-sm text-gray-500">{item.item.category} • Returned {new Date(item.returnedAt || item.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success-600">Returned</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" leftIcon={<Download size={18} />} onClick={handleExport}>
              Export Impact Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
