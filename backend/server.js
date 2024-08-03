const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const crypto = require('crypto'); // Import crypto module

const app = express();
app.use(express.json());
app.use(cors());

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
 
  database: 'medical' // Ensure this matches your actual database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit the process if the connection fails
  }
  console.log('Connected to MySQL');
});




const generateSKU = (name, strength, brand, price, type, expirationDate) => {
  const hash = crypto.createHash('sha256');
  hash.update(`${name}${strength}${brand}${price}${type}${expirationDate}`);
  return hash.digest('hex').slice(0, 10); // Return first 10 characters of hash
};

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log('Parsed data:', data);

    const insertPromises = data.map(row => {
      const { Name: name, Brand: brand, Type: type, Strength: strength, 'Expiration Date': expirationDate, Price: price, Quantity: quantity } = row;

      if (!name || !brand || !type || !strength || !expirationDate || !price || !quantity) {
        console.error('Invalid data row:', row);
        return Promise.reject(new Error('Invalid data row'));
      }

      const sku_id = generateSKU(name, strength, brand, price, type, expirationDate);

      return new Promise((resolve, reject) => {
        const checkSql = 'SELECT quantity FROM medicine WHERE sku_id = ?';
        db.query(checkSql, [sku_id], (err, results) => {
          if (err) {
            console.error('Error checking SKU ID:', err);
            reject(err);
          } else if (results.length > 0) {
            const updateSql = 'UPDATE medicine SET quantity = quantity + ? WHERE sku_id = ?';
            db.query(updateSql, [quantity, sku_id], (updateErr, updateResult) => {
              if (updateErr) {
                console.error('Error updating quantity:', updateErr);
                reject(updateErr);
              } else {
                console.log('Quantity updated:', updateResult);
                resolve(updateResult);
              }
            });
          } else {
            const insertSql = 'INSERT INTO medicine (sku_id, name, brand, type, strength, expiration_date, price, quantity, availability_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertSql, [sku_id, name, brand, type, strength, expirationDate, price, quantity, 'instock'], (insertErr, insertResult) => {
              if (insertErr) {
                console.error('Error inserting data:', insertErr);
                reject(insertErr);
              } else {
                console.log('Data inserted:', insertResult);
                resolve(insertResult);
              }
            });
          }
        });
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error removing file:', err);
        });
        res.send('File uploaded and data processed successfully.');
      })
      .catch((err) => {
        console.error('Error processing file data:', err);
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error removing file:', err);
        });
        res.status(500).send('Error processing file data.');
      });
  } catch (err) {
    console.error('Unexpected error:', err);
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error removing file:', err);
    });
    res.status(500).send('Unexpected error occurred.');
  }
});



  
// Function to update quantity and status
const updateQuantityAndStatus = (update) => {
  return new Promise((resolve, reject) => {
    const { sku_id, quantity } = update;

    // Update quantity and status
    const sqlQuery = `
      UPDATE medicine
      SET quantity = quantity - ?,
          availability_status = CASE
            WHEN quantity - ? <= 0 THEN 'outofstock'
            ELSE 'instock'
          END
      WHERE sku_id = ?;
    `;
    db.query(sqlQuery, [quantity, quantity, sku_id], (err, result) => {
      if (err) {
        console.error('Error updating quantity and status:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Handle reorder request
app.post('/reorder', async (req, res) => {
  const { items, mobileNumber } = req.body;

  if (!items || !mobileNumber) {
    return res.status(400).send('Missing items or mobileNumber');
  }

  try {
    // Replace with actual logic, e.g., updating the database
    console.log('Received reorder request:', { items, mobileNumber });

    // Simulate processing
    // await processOrder(items, mobileNumber);

    res.status(200).send('Order submitted successfully');
  } catch (error) {
    console.error('Error processing reorder:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// Endpoint to fetch all medicines with optional filtering
app.get('/medicines', (req, res) => {
  const { brand, type, strength, expirationDate, price, availabilityStatus } = req.query;

  let sqlQuery = 'SELECT * FROM medicine WHERE 1=1';
  const params = [];

  if (brand) {
    sqlQuery += ' AND brand = ?';
    params.push(brand);
  }
  if (type) {
    sqlQuery += ' AND type = ?';
    params.push(type);
  }
  if (strength) {
    sqlQuery += ' AND strength = ?';
    params.push(strength);
  }
  if (expirationDate) {
    sqlQuery += ' AND expiration_date = ?';
    params.push(expirationDate);
  }
  if (price) {
    sqlQuery += ' AND price <= ?';
    params.push(price);
  }
  if (availabilityStatus) {
    sqlQuery += ' AND availability_status = ?';
    params.push(availabilityStatus);
  }

  db.query(sqlQuery, params, (err, results) => {
    if (err) {
      console.error('Error fetching medicines:', err);
      res.status(500).send('Error fetching medicines');
    } else {
      res.json(results);
    }
  });
});

// Search Endpoint
app.get('/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Query parameter "q" is required.');
  }

  const sqlQuery = 'SELECT * FROM medicine WHERE name LIKE ? OR brand LIKE ?';
  db.query(sqlQuery, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      console.error('Error searching medicines:', err);
      res.status(500).send('Error searching medicines');
    } else {
      res.json(results);
    }
  });
});

// Filter Options Endpoint
app.get('/filter-options', async (req, res) => {
  const queries = {
    brands: 'SELECT DISTINCT brand FROM medicine',
    types: 'SELECT DISTINCT type FROM medicine',
    strengths: 'SELECT DISTINCT strength FROM medicine',
    expirationDates: 'SELECT DISTINCT expiration_date FROM medicine',
    statuses: 'SELECT DISTINCT availability_status FROM medicine'
  };

  try {
    const results = await Promise.all(
      Object.entries(queries).map(([key, query]) => {
        return new Promise((resolve, reject) => {
          db.query(query, (err, rows) => {
            if (err) {
              console.error(`Error executing query for ${key}:`, err);
              reject(err);
            } else {
              resolve({ [key]: rows.map(row => row[key] || '') });
            }
          });
        });
      })
    );

    const finalResults = results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
    console.log('Final filter options:', finalResults);
    res.json(finalResults);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).send('Error fetching filter options');
  }
});

// Statistics Endpoint
app.get('/stats', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM medicine) AS total_products,
      (SELECT COUNT(*) FROM medicine WHERE expiration_date < CURDATE()) AS expired_products,
      (SELECT COUNT(*) FROM medicine WHERE quantity > 0) AS instock_products,
      (SELECT COUNT(*) FROM medicine WHERE quantity = 0) AS outofstock_products;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stats:', err);
      res.status(500).send('Error fetching stats');
    } else {
      res.json(results[0]);
    }
  });
});

// Endpoint to save a bill
app.post('/save-bill', (req, res) => {
  const { date, time, items, totalPrice } = req.body;

  if (!date || !time || !items || !totalPrice) {
    return res.status(400).send('Missing required fields.');
  }

  const sqlQuery = 'INSERT INTO bills (date, time, items, total_price) VALUES (?, ?, ?, ?)';
  db.query(sqlQuery, [date, time, JSON.stringify(items), totalPrice], (err, result) => {
    if (err) {
      console.error('Error saving bill:', err);
      return res.status(500).send(`Error saving bill: ${err.message}`);
    }
    res.status(200).send('Bill saved successfully.');
  });
});

// Endpoint to get bills
app.get('/get-bills', async (req, res) => {
  try {
    const bills = await getBillsFromDatabase();
    
    // Parse items field if it's a string
    const parsedBills = bills.map(bill => ({
      ...bill,
      items: JSON.parse(bill.items) // Parse items field
    }));

    res.status(200).json(parsedBills);
  } catch (error) {
    res.status(500).send('Error retrieving bills.');
  }
});

// Function to retrieve bills from the database
const getBillsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = 'SELECT id, date, time, items, total_price FROM bills ORDER BY date DESC, time DESC'; // Retrieve bills sorted by date and time
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error retrieving bills:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Endpoint to update medicine
app.post('/update-medicine', (req, res) => {
  const { sku_id, name, brand, strength, quantity, expiration_date, price, availability_status } = req.body;

  if (!sku_id || !name || !brand || !strength || !quantity || !expiration_date || !price || !availability_status) {
    return res.status(400).send('Missing required fields.');
  }

  const sqlQuery = `
    UPDATE medicine
    SET name = ?, brand = ?, strength = ?, quantity = ?, expiration_date = ?, price = ?, availability_status = ?
    WHERE sku_id = ?;
  `;

  db.query(sqlQuery, [name, brand, strength, quantity, expiration_date, price, availability_status, sku_id], (err, result) => {
    if (err) {
      console.error('Error updating medicine:', err);
      res.status(500).send('Error updating medicine');
    } else {
      res.send('Medicine updated successfully.');
    }
  });
});

// Endpoint for Out-of-Stock Items
app.get('/out-of-stock', (req, res) => {
  const sqlQuery = 'SELECT * FROM medicine WHERE quantity = 0';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching out-of-stock items:', err);
      res.status(500).send('Error fetching out-of-stock items');
    } else {
      res.json(results);
    }
  });
});

// Endpoint for Expired Items
app.get('/expired-items', (req, res) => {
  const sqlQuery = 'SELECT * FROM medicine WHERE expiration_date < CURDATE()';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching expired items:', err);
      res.status(500).send('Error fetching expired items');
    } else {
      res.json(results);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
