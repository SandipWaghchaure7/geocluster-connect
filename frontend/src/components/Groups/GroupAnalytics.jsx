import React, { useMemo } from 'react';
import { BarChart, Users, MessageCircle, TrendingUp } from 'lucide-react';

const GroupAnalytics = ({ group, messages }) => {
  const analytics = useMemo(() => {
    // Message count per user
    const messageCounts = {};
    messages.forEach(msg => {
      const username = msg.sender.username;
      messageCounts[username] = (messageCounts[username] || 0) + 1;
    });

    // Most active user
    const mostActive = Object.entries(messageCounts).sort((a, b) => b[1] - a[1])[0];

    // Messages per day (last 7 days)
    const last7Days = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      last7Days[dateStr] = 0;
    }

    messages.forEach(msg => {
      const dateStr = new Date(msg.createdAt).toLocaleDateString();
      if (last7Days.hasOwnProperty(dateStr)) {
        last7Days[dateStr]++;
      }
    });

    return {
      totalMessages: messages.length,
      totalMembers: group.members.length,
      messageCounts,
      mostActive,
      last7Days
    };
  }, [group, messages]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart size={24} className="text-blue-500" />
        Group Analytics
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={20} className="text-blue-500" />
            <p className="text-sm text-blue-600 font-semibold">Messages</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">{analytics.totalMessages}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-green-500" />
            <p className="text-sm text-green-600 font-semibold">Members</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{analytics.totalMembers}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-purple-500" />
            <p className="text-sm text-purple-600 font-semibold">Most Active</p>
          </div>
          <p className="text-lg font-bold text-purple-900">
            {analytics.mostActive ? `${analytics.mostActive[0]} (${analytics.mostActive[1]} msgs)` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Message Activity Chart */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Last 7 Days Activity</h4>
        <div className="space-y-2">
          {Object.entries(analytics.last7Days).reverse().map(([date, count]) => {
            const maxCount = Math.max(...Object.values(analytics.last7Days));
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={date} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{date}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold transition-all"
                    style={{ width: `${percentage}%` }}
                  >
                    {count > 0 && count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">Top Contributors</h4>
        <div className="space-y-2">
          {Object.entries(analytics.messageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([username, count], idx) => (
              <div key={username} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  <span className="text-gray-800 font-medium">{username}</span>
                </div>
                <span className="text-gray-600 text-sm">{count} messages</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupAnalytics;