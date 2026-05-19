import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'

const monthlyData = [
  { name: 'Jan', revenue: 4000, users: 240, orders: 120 },
  { name: 'Feb', revenue: 3000, users: 280, orders: 98 },
  { name: 'Mar', revenue: 5000, users: 320, orders: 150 },
  { name: 'Apr', revenue: 4500, users: 290, orders: 135 },
  { name: 'May', revenue: 6000, users: 380, orders: 180 },
  { name: 'Jun', revenue: 5500, users: 410, orders: 165 },
]

const recentOrders = [
  { id: '#001', customer: 'Alice Johnson', product: 'Wireless Headphones', amount: 129, status: 'Completed' },
  { id: '#002', customer: 'Bob Smith', product: 'Mechanical Keyboard', amount: 149, status: 'Processing' },
  { id: '#003', customer: 'Carol White', product: 'Canvas Backpack', amount: 89, status: 'Completed' },
  { id: '#004', customer: 'David Lee', product: 'Desk Lamp', amount: 59, status: 'Pending' },
  { id: '#005', customer: 'Eve Brown', product: 'Leather Notebook', amount: 24, status: 'Completed' },
]

function DashMetrics() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')

  const totalRevenue = monthlyData.reduce((acc, m) => acc + m.revenue, 0)
  const totalUsers = monthlyData.reduce((acc, m) => acc + m.users, 0)
  const totalOrders = monthlyData.reduce((acc, m) => acc + m.orders, 0)

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">DashMetrics</h1>
        <p className="text-zinc-400 mt-1">Real-time analytics overview</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', color: 'emerald' },
          { label: 'Active Users', value: totalUsers.toLocaleString(), change: '+8.2%', color: 'blue' },
          { label: 'Orders', value: totalOrders.toLocaleString(), change: '+15.3%', color: 'violet' },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50">
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <span className={`text-xs text-${stat.color}-400`}>{stat.change} vs last month</span>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">Monthly Trends</h2>
          <div className="flex gap-2">
            {(['bar', 'line', 'area'] as const).map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartType === type ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }} />
              <Bar dataKey="revenue" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="#e2c275" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="#e2c275" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="users" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50">
        <h2 className="font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-700">
                <th className="text-left pb-3 font-medium">ID</th>
                <th className="text-left pb-3 font-medium">Customer</th>
                <th className="text-left pb-3 font-medium">Product</th>
                <th className="text-left pb-3 font-medium">Amount</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-zinc-800/50">
                  <td className="py-3 text-zinc-400">{order.id}</td>
                  <td className="py-3 text-white">{order.customer}</td>
                  <td className="py-3 text-zinc-300">{order.product}</td>
                  <td className="py-3 text-white">${order.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashMetrics
