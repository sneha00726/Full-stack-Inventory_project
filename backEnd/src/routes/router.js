const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/register_loginctrl.js");
const cat_ctrl = require("../controllers/Categoryctrl.js");
const pctrl = require("../controllers/productcontroller.js");
const sctrl = require("../controllers/supplierctrl.js");
const cust_ctrl = require("../controllers/customerctrl.js");
const purctrl = require("../controllers/purchasectrl.js");
const salesctrl = require("../controllers/salesCtrl.js");
const dash = require("../controllers/Dashboardctrl.js");
const userctr = require("../controllers/userctrl.js");

const { VerifyToken } = require("../middleware/authmiddleware.js");  
const authorizeRoles  = require("../middleware/authorized.js");

// ------------------ Public APIs ------------------
router.get("/", ctrl.HomeLoginPage);
router.post("/api/register", ctrl.RegisterApi);
router.post("/api/login", ctrl.LoginPage);

// ------------------ Category APIs ------------------
router.post("/api/categories/add", VerifyToken, authorizeRoles("admin"), cat_ctrl.createCategory);
router.get("/api/categories/view", VerifyToken, authorizeRoles("admin","user"), cat_ctrl.getAllCategory);
router.get("/api/categories/:id", VerifyToken, authorizeRoles("admin"), cat_ctrl.getCategoryById);
router.put("/api/categories/update/:id", VerifyToken, authorizeRoles("admin"), cat_ctrl.UpdateCategory);
router.delete("/api/categories/delete/:id", VerifyToken, authorizeRoles("admin"), cat_ctrl.DeleteCategory);
router.get("/api/categories/search/:name", VerifyToken, authorizeRoles("admin","user"), cat_ctrl.searchCategory);

// ------------------ Product APIs ------------------
router.post("/api/products/add", VerifyToken, authorizeRoles("admin"), pctrl.addProduct);
router.get("/api/products/view", VerifyToken, authorizeRoles("admin","user"), pctrl.viewProducts);
router.get("/api/products/:id", VerifyToken, authorizeRoles("admin"), pctrl.getProdById);
router.put("/api/products/update/:id", VerifyToken, authorizeRoles("admin","user"), pctrl.updateProdById);
router.delete("/api/products/delete/:id", VerifyToken, authorizeRoles("admin"), pctrl.deleteProdById);
router.get("/api/products/search/:name", VerifyToken, authorizeRoles("admin","user"), pctrl.searchProdByName);

// ------------------ Supplier APIs ------------------
router.post("/api/suppliers/add", VerifyToken, authorizeRoles("admin"), sctrl.addSupplier);
router.get("/api/suppliers/view", VerifyToken, authorizeRoles("admin"), sctrl.viewSuppliers);
router.get("/api/suppliers/:id", VerifyToken, authorizeRoles("admin"), sctrl.getSupplierById);
router.put("/api/suppliers/update/:id", VerifyToken, authorizeRoles("admin"), sctrl.updateSupplierById);
router.delete("/api/suppliers/delete/:id", VerifyToken, authorizeRoles("admin"), sctrl.deleteSupplierById);
router.get("/api/suppliers/search/:name", VerifyToken, authorizeRoles("admin"), sctrl.searchSupplier);

// ------------------ Customer APIs ------------------
router.post("/api/customer/add", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.AddCustomer);
router.get("/api/customer/view", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.viewAllCustomer);
router.get("/api/customer/:id", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.customerGetById);
router.put("/api/customer/updateBy/:id", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.UpdateCustomer);
router.delete("/api/customer/delete/:id", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.CustomerDelete);
router.get("/api/customer/search/:name", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.CustSearch);

// ------------------ Purchase APIs ------------------
router.post("/api/purchases/add", VerifyToken, authorizeRoles("admin"), purctrl.addPurchase);
router.get("/api/purchases/view", VerifyToken, authorizeRoles("admin"), purctrl.viewPurchases);
router.get("/api/purchases/:id", VerifyToken, authorizeRoles("admin"), purctrl.getPurchaseById);
router.put("/api/purchases/update/:id", VerifyToken, authorizeRoles("admin"), purctrl.updatePurchaseById);
router.delete("/api/purchases/delete/:id", VerifyToken, authorizeRoles("admin"), purctrl.deletePurchaseById);
router.get("/api/purchases/search/:name", VerifyToken, authorizeRoles("admin"), purctrl.purchasesearch);

// ------------------ Sales APIs ------------------
router.post("/api/sales/add", VerifyToken, authorizeRoles("admin","user"), salesctrl.addSale);
router.get("/api/sales/view", VerifyToken, authorizeRoles("admin","user"), salesctrl.ViewAllSales);
router.get("/api/sales/:id", VerifyToken, authorizeRoles("admin","user"), salesctrl.GetbyIDSales);
router.put("/api/sales/update/:id", VerifyToken, authorizeRoles("admin","user"), salesctrl.updateSalesById);
router.delete("/api/sales/delete/:id", VerifyToken, authorizeRoles("admin","user"), salesctrl.deleteSalesById);
router.get("/api/sales/search/:invoice", VerifyToken, authorizeRoles("admin","user"), salesctrl.salesSearch);
router.get("/api/sales/download/:id", VerifyToken, authorizeRoles("admin","user"), salesctrl.downloadInvoice);

// ------------------ User APIs ------------------
router.post("/api/users/add", VerifyToken, authorizeRoles("admin"), userctr.addUser);
router.get("/api/users/view", VerifyToken, authorizeRoles("admin"), userctr.viewUsers);
router.put("/api/users/update/:id", VerifyToken, authorizeRoles("admin"), userctr.updateUser);
router.delete("/api/users/delete/:id", VerifyToken, authorizeRoles("admin"), userctr.deleteUser);
router.get("/api/users/search/:keyword", VerifyToken, authorizeRoles("admin"), userctr.searchUsers);

// ------------------ Dashboard APIs ------------------
router.get("/api/dashboard/product", dash.getTotalProducts);
router.get("/api/dashboard/category", dash.getCategoryWiseCount);
router.get("/api/dashboard/salesperprod", dash.getSalesPerProduct);
router.get("/api/dashboard/getWeeklySales", dash.getWeeklySales);
router.get("/api/dashboard/lowstock", dash.getLowStockProducts);
router.get("/api/dashboard/totalsales", dash.getTotalSales);

module.exports = router;
