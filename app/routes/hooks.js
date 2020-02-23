const express = require('express');
const app = express();
const ctrl = require('../controller')
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.json();
const router = express.Router();
const hooks=ctrl.hooks


router.post('/receive',urlencodedParser,hooks.sendTwilio);
router.post('/dialogueflow',urlencodedParser,hooks.sendDialogueFlow);
router.post('/mpesapayment',urlencodedParser, hooks.mpesaPayment);
router.post('/flutterwave', urlencodedParser, hooks.flutterWave);
module.exports = router;