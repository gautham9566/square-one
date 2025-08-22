// Orders management component similar to the reference image
import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Table from './ui/Table';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';

const OrdersManagement = ({ 
  orders = [],
  onUpdateStatus,
  onDeleteOrder,
  onExportOrders,
  onBulkUpdate
}) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    search: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === filters.status);
    }

    // Filter by payment status
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus.toLowerCase() === filters.paymentStatus);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  const handleSelectOrder = (orderId, isSelected) => {
    if (isSelected) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'completed': return 'completed';
      case 'ongoing': return 'warning';
      case 'finished': return 'success';
      case 'refunded': return 'refunded';
      default: return 'default';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'paid';
      case 'unpaid': return 'unpaid';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (orderToDelete && onDeleteOrder) {
      onDeleteOrder(orderToDelete.id);
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
    const shippedOrders = orders.filter(o => o.status.toLowerCase() === 'completed').length;
    const refundedOrders = orders.filter(o => o.status.toLowerCase() === 'refunded').length;

    return { totalOrders, pendingOrders, shippedOrders, refundedOrders };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onExportOrders}>
              Export Orders
            </Button>
            <Button variant="primary">
              Add Orders
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total Orders This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-500">Pending Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.shippedOrders}</p>
            <p className="text-sm text-gray-500">Shipped Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.refundedOrders}</p>
            <p className="text-sm text-gray-500">Refunded Orders</p>
          </div>
        </div>
      </Card>

      {/* Filters and controls */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filter tabs */}
          <div className="flex space-x-1">
            {['All', 'Incomplete', 'Overdue', 'Ongoing', 'Finished'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  (tab.toLowerCase() === filters.status) || (tab === 'All' && filters.status === 'all')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setFilters(prev => ({ ...prev, status: tab === 'All' ? 'all' : tab.toLowerCase() }))}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and filters */}
          <div className="flex space-x-3">
            <Input
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
            <Select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </Select>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Duplicate
              </Button>
              <Button size="sm" variant="outline">
                Print
              </Button>
              <Button size="sm" variant="danger">
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Orders table */}
      <Card padding="none">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                />
              </Table.Head>
              <Table.Head>Order Number</Table.Head>
              <Table.Head>Customer Name</Table.Head>
              <Table.Head>Order Date</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Total Amount</Table.Head>
              <Table.Head>Payment Status</Table.Head>
              <Table.Head>Action</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredOrders.map((order) => (
              <Table.Row key={order.id} clickable>
                <Table.Cell>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                  />
                </Table.Cell>
                <Table.Cell className="font-medium text-blue-600">
                  {order.orderNumber}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {order.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{order.customerName}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {formatDate(order.orderDate)}
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="font-medium">
                  {formatAmount(order.totalAmount)}
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                      ✏️
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteOrder(order)}
                    >
                      🗑️
                    </Button>
                    <Button size="sm" variant="ghost">
                      ⋯
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1-9 of {filteredOrders.length} entries
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="outline">Previous</Button>
            <Button size="sm" variant="primary">1</Button>
            <Button size="sm" variant="outline">2</Button>
            <Button size="sm" variant="outline">3</Button>
            <Button size="sm" variant="outline">...</Button>
            <Button size="sm" variant="outline">12</Button>
            <Button size="sm" variant="outline">Next</Button>
          </div>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Order"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete order {orderToDelete?.orderNumber}? This action cannot be undone.
        </p>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersManagement;
