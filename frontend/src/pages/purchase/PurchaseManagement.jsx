import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import PurchaseService from "../../services/PurchaseService";
import { Button, Table, Form } from "react-bootstrap";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Records per page
  const navigate = useNavigate();

  // Fetch all purchases
  const getPurchases = () => {
    PurchaseService.getAllPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getPurchases();
  }, []);

  // Search purchases
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        PurchaseService.searchPurchase(search)
          .then((res) => {
            setPurchases(res.data);
            setCurrentPage(1);
          })
          .catch((err) => console.error(err));
      } else {
        getPurchases();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Delete purchase
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      PurchaseService.deletePurchase(id)
        .then(() => getPurchases())
        .catch((err) => console.error(err));
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentPurchases = purchases.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(purchases.length / pageSize);

  const paginate = (page) => setCurrentPage(page);

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>Purchase Management</h3>
        <Button
          variant="success"
          onClick={() => navigate("/dashboard/purchases/add")}
        >
          + Add Purchase
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by invoice or supplier"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>GST Invoice</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {currentPurchases.length > 0 ? (
    currentPurchases.reduce((acc, purchase, index, arr) => {
      // Group items by purchase ID
      const exists = acc.find((group) => group.purchaseid === purchase.purchaseid);
      if (exists) {
        exists.items.push({
          productname: purchase.productname,
          quantity: purchase.quantity,
          price: purchase.price,
        });
      } else {
        acc.push({
          purchaseid: purchase.purchaseid,
          invoiceno: purchase.invoiceno,
          suppliername: purchase.suppliername,
          purchasedate: purchase.purchasedate,
          totalamount: purchase.totalamount,
          paymentmode: purchase.paymentmode,
          gstinvoice: purchase.gstinvoice,
          items: [
            {
              productname: purchase.productname,
              quantity: purchase.quantity,
              price: purchase.price,
            },
          ],
        });
      }
      return acc;
    },  []).map((purchaseGroup, index, grouped) => (
  <React.Fragment key={purchaseGroup.purchaseid}>
    {/* Purchase summary row */}
    <tr className="table-striped">
      <td>{purchaseGroup.invoiceno}</td>
      <td>{purchaseGroup.suppliername}</td>
      <td>{purchaseGroup.purchasedate?.substring(0, 10)}</td>
      <td>{purchaseGroup.totalamount}</td>
      <td>{purchaseGroup.paymentmode}</td>
      <td>{purchaseGroup.gstinvoice}</td>
      <td>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(purchaseGroup.purchaseid)}
        >
          Delete
        </Button>
      </td>
    </tr>

    {/* Items with serial number */}
    {purchaseGroup.items.map((item, i) => (
      <tr key={`${purchaseGroup.purchaseid}-${i}`}>
        <td colSpan="1" className="ps-4 text-muted">{i + 1}</td>
        <td colSpan="1"><strong>{item.productname}</strong></td>
        <td>Qty: {item.quantity}</td>
        <td>Price: Rs.{parseFloat(item.price).toFixed(2)}</td>
        <td colSpan="3"></td>
      </tr>
    ))}

    {/* Spacer row between purchases */}
    {index !== grouped.length - 1 && (
      <tr>
        <td colSpan="7" style={{ height: "10px", backgroundColor: "#f8f9fa" }}></td>
      </tr>
    )}
  </React.Fragment>
))
  ) : (
    <tr>
      <td colSpan="7" className="text-danger fw-bold">
        No purchases found
      </td>
    </tr>
  )}
</tbody>

      </Table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
            >
              Prev
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default PurchaseManagement;
