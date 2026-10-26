import { cn, formatRelativeTime, formatDate } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Tabs, TabList, TabTrigger } from '../common/Tabs';

import { Link } from 'react-router-dom';
import { Package, Clock, MapPin, User, CheckCircle, XCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Eye, Star, Calendar, Leaf } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor,
  iconBg,
  trend,
  className
}) {
  return (
    <Card className={cn('stat-card', className)}>
      <div className="stat-header">
        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        {change && (
          <div className={cn(
            'stat-trend flex items-center gap-1 text-xs font-medium',
            changeType === 'positive' && 'text-success-600',
            changeType === 'negative' && 'text-error-600',
            changeType === 'neutral' && 'text-gray-500'
          )}>
            {changeType === 'positive' && <ArrowUpRight size={12} />}
            {changeType === 'negative' && <ArrowDownRight size={12} />}
            {changeType === 'neutral' && <Minus size={12} />}
            {change}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {trend && <div className="mt-2">{trend}</div>}
    </Card>
  );
}

export function RequestCard({
  request,
  type,
  onApprove,
  onReject,
  onBorrow,
  onReturn,
  onCancel,
  onView,
  isOwner: isOwnerProp,
  className
}) {
  const statusConfig = {
    Pending: { variant: 'warning', icon: <Clock size={14} />, dot: true },
    Approved: { variant: 'success', icon: <CheckCircle size={14} />, dot: true },
    Rejected: { variant: 'error', icon: <XCircle size={14} />, dot: true },
    Active: { variant: 'primary', icon: <Package size={14} />, dot: true },
    Returned: { variant: 'success', icon: <CheckCircle size={14} />, dot: true },
    Cancelled: { variant: 'gray', icon: <XCircle size={14} />, dot: true }
  };

  const config = statusConfig[request.status] || { variant: 'gray', icon: null, dot: false };
  const isOwner = isOwnerProp ?? type === 'received';
  const isBorrower = type === 'sent';
  const isActive = type === 'active';

  return (
    <Card className={cn('request-card', className)}>
      <div className="request-header">
        <div className="request-item flex-1 min-w-0">
          {request.item?.images?.[0] && (
            <img
              src={request.item.images[0]}
              alt={request.item.title}
              className="request-item-image rounded-lg"
            />
          )}
          <div className="request-item-info">
            <Link to={`/item/${request.item._id}`} className="block">
              <h4 className="request-item-title">{request.item.title}</h4>
            </Link>
            <p className="request-item-category">{request.item.category}</p>
          </div>
        </div>
        <Badge variant={config.variant} dot={config.dot}>
          {config.icon}
          {request.status}
        </Badge>
      </div>

      <div className="request-meta">
        <div className="request-meta-item">
          <User size={14} />
          <span>
            <span className="request-meta-label">{isOwner ? 'Borrower:' : 'Owner:'}</span>
            {isOwner ? request.borrower?.name : request.owner?.name}
          </span>
        </div>
        <div className="request-meta-item">
          <Clock size={14} />
          <span>
            <span className="request-meta-label">Requested:</span>
            {formatRelativeTime(request.requestedAt)}
          </span>
        </div>
        {request.dueDate && (
          <div className="request-meta-item">
            <Calendar size={14} />
            <span>
              <span className="request-meta-label">Due:</span>
              {formatDate(request.dueDate)}
            </span>
          </div>
        )}
        {request.item.location && (
          <div className="request-meta-item">
            <MapPin size={14} />
            <span className="request-meta-label">{request.item.location}</span>
          </div>
        )}
      </div>

      <div className="request-actions flex flex-wrap gap-2">
        {type === 'received' && request.status === 'Pending' && (
          <>
            <Button variant="success" size="sm" onClick={onApprove} className="flex-1 min-w-[100px]">
              <CheckCircle size={16} />
              Approve
            </Button>
            <Button variant="danger" size="sm" onClick={onReject} className="flex-1 min-w-[100px]">
              <XCircle size={16} />
              Reject
            </Button>
          </>
        )}
        {type === 'received' && request.status === 'Approved' && (
          <Button variant="primary" size="sm" onClick={onBorrow} className="flex-1 min-w-[100px]">
            <Package size={16} />
            Mark Borrowed
          </Button>
        )}
        {type === 'received' && request.status === 'Active' && (
          <Button variant="success" size="sm" onClick={onReturn} className="flex-1 min-w-[100px]">
            <CheckCircle size={16} />
            Confirm Return
          </Button>
        )}
        {isActive && isOwner && request.status === 'Active' && (
          <Button variant="success" size="sm" onClick={onReturn} className="flex-1 min-w-[100px]">
            <CheckCircle size={16} />
            Confirm Return
          </Button>
        )}
        {type === 'sent' && request.status === 'Pending' && (
          <Button variant="danger" size="sm" onClick={onCancel} className="flex-1 min-w-[100px]">
            <XCircle size={16} />
            Cancel
          </Button>
        )}
        {type === 'sent' && request.status === 'Approved' && (
          <Button variant="ghost" size="sm" onClick={onView} className="flex-1 min-w-[100px]">
            <Eye size={16} />
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
}

export function DashboardTabs({ activeTab, onTabChange, tabs, className }) {
  return (
    <Tabs value={activeTab} onChange={onTabChange} className={className}>
      <TabList role="tablist" aria-label="Dashboard sections">
        {tabs.map(tab => (
          <TabTrigger
            key={tab.id}
            value={tab.id}
            className="relative"
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

export function ImpactStatsCard({ stats, className }) {
  const statItems = [
    { label: 'Total Borrows', value: stats.totalBorrows, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-100' },
    { label: 'Items Saved', value: stats.itemsSaved, icon: Package, color: 'text-success-600', bg: 'bg-success-100' },
    { label: 'CO₂ Saved (kg)', value: stats.co2Saved.toFixed(1), icon: Leaf, color: 'text-warning-600', bg: 'bg-warning-100' },
    { label: 'Community Score', value: stats.communityScore, icon: Star, color: 'text-secondary-600', bg: 'bg-secondary-100' }
  ];

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {statItems.map((stat, i) => (
        <StatCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          icon={<stat.icon className={cn(stat.color, 'text-2xl')} size={28} />}
          iconColor={stat.color}
          iconBg={stat.bg}
        />
      ))}
    </div>
  );
}

export function PersonalImpact({ borrows, shares, netContribution, className }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
      <div className="p-4 bg-primary-50 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><ArrowDownRight size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Items Borrowed</p>
            <p className="text-2xl font-bold text-gray-900">{borrows}</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-success-50 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-success-100 text-success-600"><ArrowUpRight size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Items Shared</p>
            <p className="text-2xl font-bold text-gray-900">{shares}</p>
          </div>
        </div>
      </div>
      <div className={cn('p-4 rounded-xl', netContribution >= 0 ? 'bg-success-50' : 'bg-warning-50')}>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('p-2 rounded-lg', netContribution >= 0 ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600')}>
            {netContribution >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          <div>
            <p className="text-xs text-gray-500">Net Contribution</p>
            <p className={cn('text-2xl font-bold', netContribution >= 0 ? 'text-success-600' : 'text-warning-600')}>
              {netContribution >= 0 ? '+' : ''}{netContribution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardItem({ entry, rank, type, className }) {
  const rankColors = [
    'text-yellow-400',
    'text-gray-400',
    'text-amber-600'
  ];

  return (
    <div className={cn('leaderboard-item', className)}>
      <span className={cn('leaderboard-rank font-extrabold', rankColors[rank - 1] || 'text-gray-400')}>
        #{rank}
      </span>
      <Avatar src={entry.avatar} name={entry.name} size="lg" />
      <div className="leaderboard-info">
        <p className="leaderboard-name">{entry.name}</p>
        <div className="leaderboard-stats">
          <span>{entry.department} • Year {entry.year}</span>
          <span>{type === 'sharers' ? `${entry.sharesCount} shared` : `${entry.borrowsCount} borrowed`}</span>
        </div>
      </div>
      <div className="leaderboard-score">{entry.score}</div>
    </div>
  );
}

export function EmptyDashboard({ icon, title, message, action, className }) {
  return (
    <div className={cn('empty-state py-16', className)}>
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

export function LoadingDashboard({ count = 4, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="request-card">
          <div className="request-header">
            <div className="request-item">
              <div className="skeleton w-16 h-16 rounded-lg" />
              <div className="request-item-info">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded mt-1" />
              </div>
            </div>
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="request-meta">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
          <div className="request-actions">
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function QuickActions({ actions, className }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {actions.map((action, i) => (
        <Button
          key={i}
          variant={action.variant || 'outline'}
          leftIcon={action.icon}
          onClick={action.onClick}
          as={action.href ? 'a' : undefined}
          href={action.href}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
