
let salesModel = require("../models/salesmodel.js");
const PDFDocument = require("pdfkit");

const fs = require("fs");
const path = require("path");

require("pdfkit-table");

exports.addSale = (req, res) => {
    let { invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice } = req.body;
    const userId = req.user.id; // automatically from logged-in user
    if (!invoiceNo || !salesDate || !customerId || !items || items.length === 0 || !paymentMode || gstInvoice === undefined) {
            return reject(new Error("All fields are required"));
        }
        
    let  promise=salesModel.createSale(invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice,userId);
    promise.then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.send("sales not saved: " + err.message);
    });
}


exports.ViewAllSales=(req,res)=>
{
    let promise=salesModel.viewSales();
    promise.then((result)=>
    {
      res.status(201).json(result);

    }).catch((err)=>
    {
        res.send(err);
    });
}

exports.GetbyIDSales=(req,res)=>
{
    let id = req.params.id;
    let promise=salesModel.getSalebyID(id);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}


exports.updateSalesById = (req, res) => {
  let id = req.params.id;
  let {  paymentMode,  items } = req.body;

  salesModel.updateSales(id, paymentMode,  items)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteSalesById=(req,res)=>
{
    //console.log("hit the delete salws");
    let id = req.params.id;
    let promise=salesModel.salesDelete(id);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}
exports.salesSearch = (req, res) => {
    let invoiceNo  = req.params.invoiceNo ; //
    let promise = salesModel.searchsales(invoiceNo );

    promise.then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No sales found" });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
};


exports.downloadInvoice = (req, res) => {
  const { id } = req.params;
  const PDFDocument = require("pdfkit");
  const path = require("path");

  salesModel.getInvoiceData(id)
    .then((rows) => {
      if (!rows || rows.length === 0) {
        return res.status(404).send("Invoice not found");
      }

      const sale = rows[0];
      const doc = new PDFDocument({ margin: 30, size: "A4", bufferPages: true });

      //  Register Unicode font for ₹ symbol
      doc.registerFont("DejaVu", path.join(__dirname, "../../public/fonts/dejavu-sans/DejaVuSans.ttf"));
      doc.registerFont("DejaVu-Bold", "public/fonts/dejavu-sans/DejaVuSans-Bold.ttf");

      // Handle PDF errors
      doc.on("error", (err) => {
        console.error("PDF generation error:", err);
        if (!res.headersSent) res.status(500).send("Error generating invoice");
      });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${sale.invoiceNo}.pdf`
      );

      doc.pipe(res);

      // =========================
      // HEADER
      // =========================
      try {
        doc.image(path.join(__dirname, "../../public/Imges/INVENZA-.png"), 50, 10, { width: 160 });
      } catch (e) {
        console.log("Logo not found, skipping...");
      }

      doc.fontSize(28).fillColor("#e67e22").font("Helvetica-Bold")
        .text("INVOICE", 0, 60, { align: "right" });
      doc.moveDown(4);

      // =========================
      // BILL FROM / BILL TO
      // =========================
      const billFromX = 50;
      const billToX = 350;

      doc.fontSize(12).fillColor("black").font("Helvetica-Bold").text("Bill From:", billFromX, 120);
      doc.font("Helvetica").text("Invexa", billFromX)
        .text("123 Main Street, City, India", billFromX)
        .text("Phone: +91 12345 67890", billFromX)
        .text("Email: invexa@email.com", billFromX);

      doc.font("Helvetica-Bold").text("Bill To:", billToX, 120);
      doc.font("Helvetica")
        .text(`Name: ${sale.customer_name || "N/A"}`, billToX);
      if (sale.company_name) doc.text(`Company: ${sale.company_name}`, billToX);
      doc.text(`Email: ${sale.email || "N/A"}`, billToX)
        .text(`Payment Mode: ${sale.paymentMode || "N/A"}`, billToX);

      doc.moveDown(2);

      // =========================
      // INVOICE DETAILS
      // =========================
      doc.font("Helvetica-Bold").text(`Invoice No: ${sale.invoiceNo || "N/A"}`);
      doc.font("Helvetica").text(
        `Invoice Date: ${sale.salesDate ? new Date(sale.salesDate).toLocaleDateString() : "N/A"}`
      );
      doc.text(`Generated At: ${new Date().toLocaleString()}`);
      doc.text(`Generated By: ${sale.generated_by || "Admin"}`).moveDown(2);

     const startX = 50;
    let y = doc.y + 20;

    doc.font("Helvetica-Bold").fontSize(12).fillColor("black");
    doc.text("Item", startX, y, { width: 250 });
    doc.text("Quantity", startX + 250, y, { width: 80, align: "center" });
    doc.text("Unit Price", startX + 330, y, { width: 80, align: "right" });
    doc.text("Total", startX + 410, y, { width: 80, align: "right" });

    y += 20;

    // Draw line under header
    doc.moveTo(startX, y - 5)
      .lineTo(startX + 490, y - 5)
      .strokeColor("#e67e22")
      .stroke();

    // =========================
    // TABLE ROWS
    // =========================
    rows.forEach((item, idx) => {
      const pname = item.product_name || "Unknown Product";
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const lineTotal = (qty * rate).toFixed(2);

      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 50;
      }

          doc.font("Helvetica").fontSize(12).fillColor("black");
          doc.text(pname, startX, y, { width: 250 });
          doc.text(qty.toString(), startX + 250, y, { width: 80, align: "center" });
          doc.font("DejaVu").text(`₹${rate.toFixed(2)}`, startX + 330, y, { width: 80, align: "right" });
          doc.font("DejaVu").text(`₹${lineTotal}`, startX + 410, y, { width: 80, align: "right" });

          y += 20;
        });

        // =========================
        // TOTAL SECTION
    // =========================
    y += 10;
    doc.moveTo(startX, y).lineTo(startX + 490, y).strokeColor("#000000").stroke();

        y += 5;
        const subtotal = Number(sale.totalAmount) || 0;

        doc.font("DejaVu-Bold").fontSize(12).text(`Subtotal: ₹${subtotal.toFixed(2)}`, startX + 330, y, { align: "right" });
        y += 20;
        doc.font("DejaVu-Bold").text(`Total Due: ₹${subtotal.toFixed(2)}`, startX + 330, y, { align: "right" });
        doc.font("Helvetica");
              doc.moveDown(2);
        
      // =========================
      // TERMS & CONDITIONS
      // =========================
      doc.moveDown(2);
      doc.fontSize(10).font("Helvetica-Bold").text("Terms & Conditions");
      doc.font("Helvetica").text("Thanks for Visting our Store.");

      // =========================
      // FOOTER
      // =========================
      doc.moveDown(3);
      doc.fontSize(10).fillColor("gray").text("www.invexa.com | mail@invexa.com", { align: "center" });

      doc.end();
    })
    .catch((err) => {
      console.error("DB error:", err);
      if (!res.headersSent) res.status(500).send("Error generating invoice");
    });
};
