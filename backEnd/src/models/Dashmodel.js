let db = require("../../db.js");

// Total products count
exports.getTotalProducts = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM product", (err, result) => {
      if (err) reject(err);
      else resolve(result[0].total);
    });
  });
};
 
 exports.getTotalSales = () => {
  return new Promise((resolve, reject) => {
    db.query("select count(*) as totalsales from sales", (err, result) => {
      if (err) reject(err);
      else resolve(result[0].totalsales);
    });
  });
};
// Category-wise product count
exports.getCategoryWiseCount = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT c.cname, COUNT(p.pid) AS count
       FROM category c
       LEFT JOIN product p ON c.cid = p.cid
       GROUP BY c.cname`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Sales per product
exports.getSalesPerProduct = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.pname, SUM(si.qty) AS total_sold
       FROM sales_items si
       JOIN product p ON si.productId = p.pid
       GROUP BY si.productId, p.pname`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};
exports.getWeeklySales = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 
          DAYNAME(salesDate) AS day,
          SUM(totalAmount) AS daily_sales
       FROM sales
       WHERE YEARWEEK(salesDate, 1) = YEARWEEK(CURDATE(), 1)
       GROUP BY DAYNAME(salesDate), DAYOFWEEK(salesDate)
       ORDER BY DAYOFWEEK(salesDate)`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

exports.LowStockProducts = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT pname, stock 
       FROM product 
       WHERE stock < 10 
       ORDER BY stock ASC 
       LIMIT 10`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};