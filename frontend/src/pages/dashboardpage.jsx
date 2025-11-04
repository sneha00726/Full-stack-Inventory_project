import React, { Component, createRef } from "react";
import DashboardService from "../services/DashboardService";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import "../styles/dashboardpage.css";

const COLORS = [
  "#264653", // dark teal
  "#2a9d8f", // muted green
  "#e76f51", // dark coral
  "#f4a261", // burnt orange
  "#e9c46a", // mustard yellow
  "#8d99ae", // slate gray
  "#6a4c93", // deep purple
  "#d62828", // dark red
  "#023e8a", // navy blue
  "#f77f00"  // vivid orange
];

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.lowStockRef = createRef();
    this.state = {
      totalProducts: 0,
      totalsales:0,
      chartData: [],
      salesData: [],
      weeklySales: [],
      lowstock: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    Promise.all([
      DashboardService.getTotalProducts(),
      DashboardService.getCategoryWiseCount(),
      DashboardService.getSalesPerProduct(),
      DashboardService.getWeeklySales(),
      DashboardService.getLowStockProducts(),
      DashboardService.getTotalSales(),
    ])
      .then(([totalRes, categoryRes, salesRes, weeklyRes, lowStockRes,totalsale]) => {
        this.setState({
          totalProducts: totalRes.data.totalProducts,
          chartData: categoryRes.data.categoryWise,
          salesData: salesRes.data.salesPerProduct,
          weeklySales: weeklyRes.data.weeklySales,
          lowstock: lowStockRes.data.lowStockProducts,
          totalsales:totalsale.data.totalsales,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        this.setState({
          error: "Failed to load dashboard data",
          loading: false,
        });
      });
  }

  scrollToLowStock = () => {
    if (this.lowStockRef.current) {
      this.lowStockRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  render() {
    const {
      totalProducts,
      chartData,
      salesData,
      weeklySales,
      lowstock,
      totalsales,
      loading,
      error,
    } = this.state;

    if (loading)
      return <p className="text-center mt-5">Loading dashboard...</p>;
    if (error)
      return <p className="text-danger text-center mt-5">{error}</p>;

    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">📊 Dashboard</h2>

        {/* Top Cards */}
        <div className="dashboard-top-cards">
          <div className="dashboard-card text-center">
            <h5 className="text-muted">Total Products</h5>
            <h2 className="text-success">{totalProducts}</h2>
          </div>
          <div className="dashboard-card text-center">
            <h5 className="text-muted">Categories</h5>
            <h2 className="text-info">{chartData.length}</h2>
          </div>
           <div className="dashboard-card text-center">
            <h5 className="text-muted">Total Sales</h5>
            <h2 className="text-info">{totalsales}</h2>
          </div>
          <div
            className="dashboard-card text-center pointer"
            onClick={this.scrollToLowStock}
          >
            <h5 className="text-muted">Low Stock Products</h5>
            <h2 className="text-danger">{lowstock.length}</h2>
          </div>
        </div>

        {/* Products Per Category + Low Stock */}
<div className="dashboard-grid horizontal-cards">
  {/* Products Per Category */}
  <div className="dashboard-card category-card">
    <h4 className="text-center mb-4">Products Per Category</h4>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="cname"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={50}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cat-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Products"]} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Low Stock Products */}
  <div ref={this.lowStockRef} className="dashboard-card low-stock-card">
    <h4 className="text-center mb-4 text-red-600 font-semibold">
      Low Stock Products
    </h4>
    <div className="scrollable-table">
      <table className="table table-striped table-hover w-full mb-0">
        <thead className="table-light">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {lowstock.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center text-gray-500 py-3">
                All products are sufficiently stocked
              </td>
            </tr>
          ) : (
            lowstock.map((item, index) => (
              <tr key={index}>
                <td>{item.pname}</td>
                <td>
                  <span className="badge bg-danger">{item.stock}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
        {/* Sales Per Product + Weekly Sales */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h4 className="text-center mb-4">Sales Per Product</h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pname" angle={-30} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_sold" fill="#93e9b5ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card">
            <h4 className="text-center mb-4">This Week&apos;s Sales</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="daily_sales"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;
