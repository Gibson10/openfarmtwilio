const express = require('express');
const {upload}=require('../../services/imageupload');
const ctrl = require('../controller')
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.json();
const router = express.Router();
const productCtrl = ctrl.transactions;
const orderCtrl=ctrl.transactions;
const vendorCtrl=ctrl.transactions;
const transactionCtrl=ctrl.transactions;
const imageUpload=ctrl.transactions
const getOrders=ctrl.transactions;
const getTransactions=ctrl.transactions;
const getVendors=ctrl.transactions;
const getProducts=ctrl.transactions;
const getCustomerByPhone=ctrl.transactions;
const getVendorByPhone=ctrl.transactions

const hooks=ctrl.hooks;





 

router.post('/addOrders',urlencodedParser, orderCtrl.addOrder);
router.post('/addTransactions',urlencodedParser, transactionCtrl.addTransaction);
router.post('/addVendors',urlencodedParser, vendorCtrl.addVendors);
router.post('/addProducts',urlencodedParser, productCtrl.addProducts);
router.get('/getOrders',getOrders.getOrders);
router.get('/getTransactions',getTransactions.getTransactions);
router.get('/getVendors',getVendors.getVendors);
router.get('/getProducts',getProducts.getProducts);
router.post('/getCustomerByNumber',getCustomerByPhone.getCustomerByPhone);
router.get('/getVendorByNumber',getVendorByPhone.getVendorByPhone);
router.post('/uploadimage',urlencodedParser,upload.single('image'),imageUpload.imageUpload);

    
    


  module.exports = router;