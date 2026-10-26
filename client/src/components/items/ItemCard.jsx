import { Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../utils/formatters';
import { CardBody, CardFooter } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Skeleton } from '../layout/PageWrapper';
import { itemImage } from '../../utils/images';
import ReflectiveCard from '../ui/ReflectiveCard';
import { MapPin, Clock, Package } from 'lucide-react';

export function ItemCard({
  item,
  variant = 'default',
  showOwner = true,
  showAction = false,
  onAction,
  actionLabel = 'Borrow',
  className
}) {
  const conditionColors = {
    'New': 'success',
    'Like New': 'primary',
    'Good': 'warning',
    'Fair': 'gray'
  };

  const statusColors = {
    'Available': 'success',
    'Reserved': 'warning',
    'Borrowed': 'primary',
    'Maintenance': 'warning',
    'Removed': 'gray'
  };

  const imageUrl = itemImage(item, 800, 600);

  if (variant === 'compact') {
    return (
      <Link to={`/item/${item._id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group">
        <div className="relative w-16 h-16 flex-shrink-0">
          <ReflectiveCard width={64} height={64} radius={10} theme="light" videoSrc="" webcam={false} intro={false} className="item-reflective-surface item-reflective-compact" style={{ width: '100%', height: '100%' }}>
            <img src={imageUrl} alt={item.title} className="item-reflective-image" />
          </ReflectiveCard>
          <Badge variant={conditionColors[item.condition] || 'gray'} size="sm" className="absolute top-1 right-1">
            {item.condition}
          </Badge>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Badge variant="outline" size="sm">{item.category}</Badge>
            <span>{item.location}</span>
          </div>
        </div>
        <Badge variant={statusColors[item.status] || 'gray'} size="sm" dot>
          {item.status}
        </Badge>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/item/${item._id}`} className="card card-hover h-full group">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <ReflectiveCard width="100%" height="100%" radius={0} theme="light" tint="#ffffff" metalness={1} roughness={0.3} blurStrength={6} shine={1} glare={0.5} webcam={false} className="item-reflective-surface" style={{ width: '100%', height: '100%' }}>
            <img src={imageUrl} alt={item.title} className="item-reflective-image" />
          </ReflectiveCard>
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Badge variant={conditionColors[item.condition] || 'gray'}>{item.condition}</Badge>
            <Badge variant={statusColors[item.status] || 'gray'} dot>{item.status}</Badge>
          </div>
        </div>
        <CardBody className="pb-0">
          <p className="text-xs text-primary-600 font-medium mb-1">{item.category}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
        </CardBody>
        <CardFooter className="pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={item.owner?.avatar} name={item.owner?.name} size="sm" />
              <span className="text-sm text-gray-600">{item.owner?.name}</span>
            </div>
            {showAction && (
              <button
                onClick={(e) => { e.preventDefault(); onAction?.(); }}
                className="btn btn-primary btn-sm"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </CardFooter>
      </Link>
    );
  }

  return (
    <article className={cn('card card-hover', className)}>
      <Link to={`/item/${item._id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <ReflectiveCard width="100%" height="100%" radius={0} theme="light" tint="#ffffff" metalness={1} roughness={0.3} blurStrength={6} shine={1} glare={0.5} webcam={false} className="item-reflective-surface" style={{ width: '100%', height: '100%' }}>
            <img src={imageUrl} alt={item.title} className="item-reflective-image" />
          </ReflectiveCard>
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
            <Badge variant={conditionColors[item.condition] || 'gray'}>{item.condition}</Badge>
            <Badge variant="outline" size="sm">{item.category}</Badge>
          </div>
          <Badge
            variant={statusColors[item.status] || 'gray'}
            className="absolute bottom-3 right-3"
            dot
          >
            {item.status}
          </Badge>
        </div>
      </Link>
      <CardBody>
        <Link to={`/item/${item._id}`} className="block">
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {formatRelativeTime(item.createdAt)}
          </span>
          {item.tags?.length && (
            <span className="flex items-center gap-1">
              <Package size={14} />
              {item.tags.slice(0, 2).join(', ')}
              {item.tags.length > 2 && <span>+{item.tags.length - 2}</span>}
            </span>
          )}
        </div>
      </CardBody>
      {(showOwner || showAction) && (
        <CardFooter>
          <div className="flex items-center justify-between">
            {showOwner && item.owner && (
              <div className="flex items-center gap-2">
                <Avatar src={item.owner.avatar} name={item.owner.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.owner.name}</p>
                  <p className="text-xs text-gray-500">{item.owner.rollNumber} • {item.owner.department}</p>
                </div>
              </div>
            )}
            {showAction && (
              <button
                onClick={onAction}
                className="btn btn-primary btn-sm flex-shrink-0"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </CardFooter>
      )}
    </article>
  );
}

export function ItemGrid({
  items,
  variant = 'default',
  loading = false,
  emptyMessage = 'No items found',
  emptyAction,
  onItemAction,
  actionLabel = 'Borrow',
  className
}) {
  const gridColumns = variant === 'compact'
    ? 'grid-cols-1'
    : variant === 'featured'
      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';

  if (loading) {
    return (
      <div className={cn('grid gap-5 sm:gap-6', gridColumns, className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (!items || !items.length) {
    return (
      <div className="empty-state py-12">
        <div className="empty-state-icon">
          <Package size={48} className="text-gray-300" />
        </div>
        <h3 className="empty-state-title">{emptyMessage}</h3>
        {emptyAction && <div className="empty-state-action">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-5 sm:gap-6', gridColumns, className)}>
      {items.map(item => (
        <ItemCard
          key={item._id}
          item={item}
          variant={variant}
          showAction={!!onItemAction}
          onAction={() => onItemAction?.(item)}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
}
