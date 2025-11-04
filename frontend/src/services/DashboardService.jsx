import axios from "axios";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

class DashboardService {
  // Headers with token
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  //  Total products
  getTotalProducts() {
    return axios.get(
      "http://localhost:3000/api/dashboard/product",
      this.getAuthHeaders()
    );
  }
  
   getTotalSales() {
    return axios.get(
      "http://localhost:3000/api/dashboard/totalsales",
      this.getAuthHeaders()
    );
  }
  //  Products per category
  getCategoryWiseCount() {
    return axios.get(
      "http://localhost:3000/api/dashboard/category",
      this.getAuthHeaders()
    );
  }

  // 3 Sales per product
  getSalesPerProduct() {
    return axios.get(
      "http://localhost:3000/api/dashboard/salesperprod",
      this.getAuthHeaders()
    );
  }
  //weekly sales
  getWeeklySales() {
  return axios.get(
    "http://localhost:3000/api/dashboard/getWeeklySales",
    this.getAuthHeaders()
  );
}
 getLowStockProducts() {
  return axios.get(
    "http://localhost:3000/api/dashboard/lowstock",
    this.getAuthHeaders()
  );
}

}

export default new DashboardService();
