const express = require('express');
const router = express.Router();
const pool = require('../../logindb');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/download', async (req, res) => {
  try {
    const data = await pool.query('SELECT user_id, user_name, user_role FROM users');

    // Generate the PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="user_data.pdf"');
    doc.pipe(res);

    doc.fontSize(16).text('User Data', { align: 'center' });
    doc.moveDown();

    data.rows.forEach(item => {
      doc.fontSize(12).text(`User ID: ${item.user_id}`);
      doc.fontSize(12).text(`User Name: ${item.user_name}`);
      doc.fontSize(12).text(`User Role: ${item.user_role}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
