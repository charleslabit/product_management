const express = require("express");
const router = express.Router();
const cors = require("cors");
const moment = require("moment");

router.use(cors());
router.use(express.urlencoded({ limit: "1000mb", extended: false }));
router.use(express.json({ limit: "1000mb" }));

const projectDatabase = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "product_management",
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 300000,
      max: 100,
    },
  },
});

//Product

router.get("/get/product", (req, res) => {
  let sql = `SELECT * FROM m_product`;
  projectDatabase.raw(sql).then((data) => {
    let newData = data[0];
    newData = newData.map((rec) => {
      rec.CreatedDate = moment(rec.CreatedDate).format("YYYY-MM-DD hh:mm:ss");
      if (rec.DeletedDate) {
        rec.DeletedDate = moment(rec.DeletedDate).format("YYYY-MM-DD hh:mm:ss");
      }
      rec.UpdatedDate = moment(rec.UpdatedDate).format("YYYY-MM-DD hh:mm:ss");
      return rec;
    });

    res.send(newData);
  });
});

router.post(`/add/product`, (req, res) => {
  let sql = `INSERT INTO m_product (ProductName, ProductDescription, ProductPhoto, isFeatured, UpdatedBy)
           VALUES ('${req.body.ProductName}','${req.body.ProductDescription}','${req.body.ProductPhoto}','${req.body.isFeatured}','${req.body.UpdatedBy}')`;
  projectDatabase.raw(sql).then(() => {
    res.send("ADDED!");
  });
});

router.post(`/update/product`, (req, res) => {
  const CURRENT_TIMESTAMP = moment().format("YYYY-MM-DD hh:mm:ss");

  let sql = `UPDATE m_product
               SET ProductName = '${req.body.ProductName}',  ProductDescription = '${req.body.ProductDescription}', ProductPhoto = '${req.body.ProductPhoto}', isFeatured = '${req.body.isFeatured}',UpdatedDate = '${CURRENT_TIMESTAMP}' ,UpdatedBy = '${req.body.UpdatedBy}'
              WHERE ProductID = '${req.body.ProductID}'`;
  projectDatabase.raw(sql).then(() => {
    res.send("UPDATED!");
  });
});

router.post(`/delete/product/:id/:updatedby`, (req, res) => {
  const ID = req.params.id;
  const UPDATEDBY = req.params.updatedby;
  const CURRENT_TIMESTAMP = moment().format("YYYY-MM-DD hh:mm:ss");

  let sql = `UPDATE m_product
               SET DeletedDate = '${CURRENT_TIMESTAMP}', UpdatedDate = '${CURRENT_TIMESTAMP}', UpdatedBy = '${UPDATEDBY}' 
              WHERE ProductID = '${ID}'`;
  projectDatabase.raw(sql).then(() => {
    res.send("DELETED!");
  });
});

router.post(`/restore/product/:id/:updatedby`, (req, res) => {
  const ID = req.params.id;
  const UPDATEDBY = req.params.updatedby;
  const CURRENT_TIMESTAMP = moment().format("YYYY-MM-DD hh:mm:ss");

  let sql = `UPDATE m_product
               SET DeletedDate =  NULL, UpdatedDate = '${CURRENT_TIMESTAMP}', UpdatedBy = '${UPDATEDBY}'
              WHERE productID = '${ID}'`;
  projectDatabase.raw(sql).then(() => {
    res.send("RESTORED!");
  });
});

module.exports = router;
