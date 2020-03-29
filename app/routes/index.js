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
const deleteProductById=ctrl.transactions
const deleteVendorById=ctrl.transactions
const addAndroidOrders=ctrl.transactions
const getAndroidOrders=ctrl.transactions

const hooks=ctrl.hooks;

router.post('/addOrders',urlencodedParser, orderCtrl.addOrder);
router.post('/addAndroidOrders',urlencodedParser, addAndroidOrders.addAndroidOrders);
router.get('/getAndroidOrders',urlencodedParser, getAndroidOrders.getAndroidOrders);
router.post('/addTransactions',urlencodedParser, transactionCtrl.addTransaction);
router.post('/addVendors',urlencodedParser, vendorCtrl.addVendors);
router.post('/addProducts',urlencodedParser,upload,productCtrl.addProducts);
router.get('/getOrders',getOrders.getOrders);
router.get('/getTransactions',getTransactions.getTransactions);
router.get('/getVendors',getVendors.getVendors);
router.get('/getProducts',getProducts.getProducts);
router.post('/getCustomerByNumber',getCustomerByPhone.getCustomerByPhone);
router.post('/getVendorByNumber',getVendorByPhone.getVendorByPhone);
router.post('/deleteVendorById',urlencodedParser,deleteVendorById.deleteVendorById);
router.post('/deleteProductById',urlencodedParser,deleteProductById.deleteProductById);


    
    


  module.exports = router;