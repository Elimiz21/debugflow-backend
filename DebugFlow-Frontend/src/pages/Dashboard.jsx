import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import { 
  Bug, 
  Code, 
  Play, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { socket, isConnected } = useContext(SocketContext);
  const [stats, setStats] = useState({
    totalBugs: 42,
    resolvedBugs: 38,
    activeProjects: 5,
    codeAnalyses: 127
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-project', 'dashboard');
      
      socket.on('debug-response', (data) => {
        console.log('Dashboard update:', data);
        setRecentActivity(prev => [
          { 
            id: Date.now(),
            message: data.message,
            timestamp: data.timestamp,
            type: 'debug'
          },
          ...prev.slice(0, 9)
        ]);
      });
    }
  }, [socket]);

  const StatCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DebugFlow Dashboard</h1>
          <p className="text-gray-600">Monitor your debugging activities and project health</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Bug} 
          title="Total Bugs" 
          value={stats.totalBugs} 
          color="red" 
        />
        <StatCard 
          icon={CheckCircle} 
          title="Resolved Bugs" 
          value={stats.resolvedBugs} 
          color="green" 
        />
        <StatCard 
          icon={Code} 
          title="Active Projects" 
          value={stats.activeProjects} 
          color="blue" 
        />
        <StatCard 
          icon={BarChart3} 
          title="Code Analyses" 
          value={stats.codeAnalyses} 
          color="purple" 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Code className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium">Start Code Analysis</span>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Play className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium">Begin Debug Session</span>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Bug className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium">Report New Bug</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>No recent activity. Start debugging to see updates here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
