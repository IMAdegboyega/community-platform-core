import React from 'react';

const TransactionsTable = ({ transactions = [] }) => {
  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <div className="h-full text-center py-12">
        <p className="text-gray-500">You have not made any transaction yet</p>
      </div>
    );
  }

  // Function to get status styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'text-green-600  px-2 py-1 text-xs font-medium';
      case 'pending':
        return 'text-orange-600 px-2 py-1 text-xs font-medium';
      case 'failed':
        return 'text-red-600 px-2 py-1 text-xs font-medium';
      default:
        return 'text-gray-600 bg-gray-50 px-2 py-1 text-xs font-medium';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-100">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Recipient</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-b bg-white border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
              <td className="py-3 px-4 text-sm text-gray-900">{transaction.description}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{transaction.recipient}</td>
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">{transaction.amount}</td>
              <td className="py-3 px-4">
                <span className={getStatusStyle(transaction.status)}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
