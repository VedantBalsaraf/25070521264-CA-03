import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context';

import { DashboardTabs, RequestCard, EmptyDashboard, LoadingDashboard, StatCard } from '../components/dashboard/DashboardComponents';
import { ItemGrid } from '../components/items';
import { Button } from '../components/common/Button';
import { useToastHelpers } from '../components/common/Toast';
import {
  approveRequest,
  cancelRequest,
  confirmReturn,
  getReceivedRequests,
  getSentRequests,
  markAsBorrowed,
  rejectRequest
} from '../services/borrowService';
import { getMyItems } from '../services/itemService';
import { getErrorMessage } from '../utils/formatters';

import { Package, Clock, TrendingUp, Inbox, PackageOpen, Plus, CheckCircle } from 'lucide-react';

const TABS = [
  { id: 'my-items', label: 'My Items', icon: <PackageOpen size={18} /> },
  { id: 'sent', label: 'Sent Requests', icon: <Package size={18} /> },
  { id: 'received', label: 'Received Requests', icon: <Inbox size={18} /> },
  { id: 'active', label: 'Active Borrows', icon: <PackageOpen size={18} /> },
  { id: 'history', label: 'History', icon: <Clock size={18} /> }
];

const mockSentRequests = [
  {
    _id: '1',
    item: { _id: '1', title: 'Canon EOS R50 Camera', images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Cameras', owner: { _id: 'u1', name: 'Arjun Patel', rollNumber: 'EC2021045', department: 'Electronics', year: 4 } },
    borrower: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    owner: { _id: 'u1', name: 'Arjun Patel', rollNumber: 'EC2021045', department: 'Electronics', year: 4 },
    status: 'Pending',
    requestedAt: '2024-02-15T10:30:00Z',
    dueDate: '2024-02-25T10:30:00Z',
    notes: 'Need for photography project'
  },
  {
    _id: '2',
    item: { _id: '2', title: 'Engineering Mathematics Textbook', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Books', owner: { _id: 'u3', name: 'Priya Sharma', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 } },
    borrower: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    owner: { _id: 'u3', name: 'Priya Sharma', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    status: 'Approved',
    requestedAt: '2024-02-10T14:00:00Z',
    approvedAt: '2024-02-10T15:30:00Z',
    dueDate: '2024-02-20T14:00:00Z',
    notes: 'For MA202 exam prep'
  }
];

const mockReceivedRequests = [
  {
    _id: '3',
    item: { _id: '3', title: 'TI-84 Plus CE Calculator', images: ['https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Calculators', owner: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 } },
    borrower: { _id: 'u4', name: 'Rohit Kumar', rollNumber: 'EE2022034', department: 'Electrical', year: 3 },
    owner: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    status: 'Pending',
    requestedAt: '2024-02-16T09:00:00Z',
    dueDate: '2024-02-26T09:00:00Z',
    notes: 'Need for circuits lab'
  },
  {
    _id: '4',
    item: { _id: '4', title: 'Arduino Starter Kit', images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Project Equipment', owner: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 } },
    borrower: { _id: 'u5', name: 'Ananya Gupta', rollNumber: 'CS2021056', department: 'Computer Science', year: 3 },
    owner: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    status: 'Approved',
    requestedAt: '2024-02-12T11:00:00Z',
    approvedAt: '2024-02-12T12:00:00Z',
    dueDate: '2024-02-22T11:00:00Z',
    notes: 'For IoT project'
  }
];

const mockActiveBorrows = [
  {
    _id: '5',
    item: { _id: '5', title: 'Multimeter Fluke 117', images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Tools', owner: { _id: 'u6', name: 'Vikram Singh', rollNumber: 'EE2021089', department: 'Electrical', year: 4 } },
    borrower: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    owner: { _id: 'u6', name: 'Vikram Singh', rollNumber: 'EE2021089', department: 'Electrical', year: 4 },
    status: 'Active',
    requestedAt: '2024-02-01T10:00:00Z',
    approvedAt: '2024-02-01T10:30:00Z',
    borrowedAt: '2024-02-02T14:00:00Z',
    dueDate: '2024-02-12T14:00:00Z'
  }
];

const mockHistory = [
  {
    _id: '6',
    item: { _id: '6', title: 'MacBook Pro 14"', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=600&q=80'], category: 'Electronics', owner: { _id: 'u7', name: 'Sneha Reddy', rollNumber: 'ME2022012', department: 'Mechanical', year: 2 } },
    borrower: { _id: 'u2', name: 'You', rollNumber: 'CS2021001', department: 'Computer Science', year: 3 },
    owner: { _id: 'u7', name: 'Sneha Reddy', rollNumber: 'ME2022012', department: 'Mechanical', year: 2 },
    status: 'Returned',
    requestedAt: '2024-01-10T10:00:00Z',
    approvedAt: '2024-01-10T11:00:00Z',
    borrowedAt: '2024-01-11T09:00:00Z',
    returnedAt: '2024-01-21T17:00:00Z',
    dueDate: '2024-01-21T09:00:00Z'
  }
];

export function BorrowDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToastHelpers();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'sent');
  const [sentRequests, setSentRequests] = useState(mockSentRequests);
  const [receivedRequests, setReceivedRequests] = useState(mockReceivedRequests);
  const [activeBorrows, setActiveBorrows] = useState(mockActiveBorrows);
  const [history, setHistory] = useState(mockHistory);
  const [myItems, setMyItems] = useState([]);
  const [myItemsLoading, setMyItemsLoading] = useState(true);
  const [myItemsError, setMyItemsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const refreshRequests = useCallback(async () => {
    const [sentData, receivedData] = await Promise.all([getSentRequests(), getReceivedRequests()]);
    const sent = Array.isArray(sentData?.requests) ? sentData.requests : [];
    const received = Array.isArray(receivedData?.requests) ? receivedData.requests : [];
    const allRequests = [...sent, ...received];
    setSentRequests(sent);
    setReceivedRequests(received);
    setActiveBorrows(allRequests.filter(request => request.status === 'Active'));
    setHistory(allRequests.filter(request => request.status === 'Returned'));
    setDemoMode(false);
  }, []);

  const refreshMyItems = useCallback(async () => {
    setMyItemsLoading(true);
    setMyItemsError('');
    try {
      const response = await getMyItems();
      setMyItems(Array.isArray(response?.items) ? response.items : []);
    } catch (err) {
      setMyItemsError(getErrorMessage(err));
    } finally {
      setMyItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshRequests().catch(() => {
      if (cancelled) return;
      setSentRequests(mockSentRequests);
      setReceivedRequests(mockReceivedRequests);
      setActiveBorrows(mockActiveBorrows);
      setHistory(mockHistory);
      setDemoMode(true);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    refreshMyItems();
    return () => { cancelled = true; };
  }, [refreshRequests, refreshMyItems, user?._id]);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  const runRequestAction = async (action, successMessage) => {
    if (demoMode) {
      toast.info('Connect to the server', 'Dashboard actions are disabled while sample data is shown.');
      return;
    }
    setLoading(true);
    try {
      await action();
      await refreshRequests();
      toast.success(successMessage);
    } catch (err) {
      toast.error('Could not update request', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = requestId => runRequestAction(() => approveRequest(requestId), 'Request approved');
  const handleReject = requestId => runRequestAction(() => rejectRequest(requestId), 'Request declined');
  const handleBorrow = requestId => runRequestAction(() => markAsBorrowed(requestId), 'Borrow marked as active');
  const handleReturn = requestId => runRequestAction(() => confirmReturn(requestId), 'Return confirmed');
  const handleCancel = requestId => runRequestAction(() => cancelRequest(requestId), 'Request cancelled');

  const getTabData = () => {
    switch (activeTab) {
      case 'my-items': return myItems;
      case 'sent': return sentRequests;
      case 'received': return receivedRequests;
      case 'active': return activeBorrows;
      case 'history': return history;
      default: return [];
    }
  };

  const getEmptyState = () => {
    switch (activeTab) {
      case 'my-items':
        return { icon: <PackageOpen size={48} className="text-gray-300" />, title: 'No shared items yet', message: 'Items you list will appear here so you can manage your listings.', action: <Button as="a" href="/share">Share an Item</Button> };
      case 'sent':
        return { icon: <Package size={48} className="text-gray-300" />, title: 'No sent requests', message: 'You haven\'t requested to borrow any items yet. Start exploring!', action: <Button as="a" href="/explore">Explore Items</Button> };
      case 'received':
        return { icon: <Inbox size={48} className="text-gray-300" />, title: 'No received requests', message: 'No one has requested to borrow your items yet. Share an item to start receiving requests!', action: <Button as="a" href="/share">Share an Item</Button> };
      case 'active':
        return { icon: <PackageOpen size={48} className="text-gray-300" />, title: 'No active borrows', message: 'You don\'t have any items currently borrowed. Your approved requests will appear here.', action: <Button as="a" href="/dashboard?tab=sent">View Sent Requests</Button> };
      case 'history':
        return { icon: <Clock size={48} className="text-gray-300" />, title: 'No borrowing history', message: 'Your completed borrows and returns will appear here.', action: null };
      default:
        return { icon: <Package size={48} className="text-gray-300" />, title: 'No data', message: 'No items to display.', action: null };
    }
  };

  const tabData = getTabData();
  const emptyState = getEmptyState();

  const stats = [
    { label: 'Pending Sent', value: sentRequests.filter(r => r.status === 'Pending').length, icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100' },
    { label: 'Approved Sent', value: sentRequests.filter(r => r.status === 'Approved').length, icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100' },
    { label: 'Pending Received', value: receivedRequests.filter(r => r.status === 'Pending').length, icon: Inbox, color: 'text-primary-600', bg: 'bg-primary-100' },
    { label: 'Active Borrows', value: activeBorrows.length, icon: PackageOpen, color: 'text-secondary-600', bg: 'bg-secondary-100' }
  ];

  return (
    <div className="dashboard-page min-h-screen bg-gray-50">
      <header className="page-header">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">Borrowing Dashboard</h1>
              <p className="page-description">Manage your borrow requests, active borrows, and history</p>
            </div>
            <div className="flex gap-3">
              <Button as="a" href="/share" variant="outline" leftIcon={<Plus size={18} />}>
                Share Item
              </Button>
              <Button as="a" href="/impact" variant="primary" leftIcon={<TrendingUp size={18} />}>
                View Impact
              </Button>
            </div>
          </div>
        </div>
      </header>

      {demoMode && (
        <div className="container mt-4">
          <div className="alert alert-warning" role="status">
            Showing sample preview data because live requests could not be loaded. Sign in with a working server connection to manage real requests.
          </div>
        </div>
      )}

      <div className="page-content">
        <div className="dashboard-grid mb-8">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={<stat.icon size={24} />}
              iconColor={stat.color}
              iconBg={stat.bg}
            />
          ))}
        </div>

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={TABS}
        />

        <div className="mt-6">
          {activeTab === 'my-items' ? (
            myItemsLoading ? <LoadingDashboard count={4} /> : myItemsError ? (
              <EmptyDashboard
                icon={<PackageOpen size={48} className="text-gray-300" />}
                title="Couldn't load your items"
                message={myItemsError}
                action={<Button onClick={refreshMyItems}>Try again</Button>}
              />
            ) : myItems.length === 0 ? <EmptyDashboard {...emptyState} /> : (
              <ItemGrid items={myItems} variant="default" emptyMessage="You have no shared items yet." />
            )
          ) : loading ? (
            <LoadingDashboard count={5} />
          ) : tabData.length === 0 ? (
            <EmptyDashboard {...emptyState} />
          ) : (
            <div className="space-y-4">
              {tabData.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  type={activeTab}
                  isOwner={request.owner?._id === user?._id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  onCancel={handleCancel}
                  onView={() => request.item?._id && navigate(`/item/${request.item._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
