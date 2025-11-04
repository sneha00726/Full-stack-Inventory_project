const dashModel = require("../models/Dashmodel.js");

// Total products
exports.getTotalProducts = (req, res) => {
  dashModel.getTotalProducts()
    .then(totalProducts => {
      res.status(200).json({ success: true, totalProducts });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch total products", error: err.message });
    });
};
//total sales
exports.getTotalSales = (req, res) => {
  dashModel.getTotalSales()
    .then(totalsales => {
      res.status(200).json({totalsales });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch total sales", error: err.message });
    });
};

// Category-wise count
exports.getCategoryWiseCount = (req, res) => {
  dashModel.getCategoryWiseCount()
    .then(categoryWise => {
      res.status(200).json({ success: true, categoryWise });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch category count", error: err.message });
    });
};

// Sales per product
exports.getSalesPerProduct = (req, res) => {
  dashModel.getSalesPerProduct()
    .then(salesPerProduct => {
      res.status(200).json({ success: true, salesPerProduct });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch sales per product", error: err.message });
    });
};
exports.getWeeklySales = (req, res) => {
  dashModel.getWeeklySales()
    .then(weeklySales => {
      res.status(200).json({ success: true, weeklySales });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "Failed to fetch weekly sales",
        error: err.message,
      });
    });
};
exports.getLowStockProducts = (req, res) => {
  dashModel.LowStockProducts()
    .then(lowStockProducts => {
    //  console.log("Low stock products:", lowStockProducts); //  log result
      res.status(200).json({ success: true, lowStockProducts });
    })
    .catch(err => {
      //console.error("Error fetching low stock:", err); //  log error
      res.status(500).json({
        success: false,
        message: "Failed to fetch low stock products",
        error: err.message,
      });
    });
};