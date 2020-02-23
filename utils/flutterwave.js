require('dotenv').config()
const forge    = require('node-forge');
const request = require('request-promise-native');
const md5 = require('md5');

var options = {
	url: "",
	method: "",
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	body: {
		"PBFPubKey": "",
		"alg": "3DES-24",
		client: "",
	},
	json: true
}

class Rave {
	/**
	 * Rave object constructor
	 * @param {*} public_key This is a string that can be found in merchant rave dashboard
	 * @param {*} secret_key This is a string that can be found in merchant rave dashboard
	 */
	constructor(public_key, secret_key){
        this.public_key = public_key;
        this.secret_key = secret_key;
    }

	encryptCardDetails(card_details) {
        card_details = JSON.stringify(card_details);
        let cipher   = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(this.getKey()));
        cipher.start({iv:''});
        cipher.update(forge.util.createBuffer(card_details, 'utf-8'));
        cipher.finish();
        let encrypted = cipher.output;
        return ( forge.util.encode64(encrypted.getBytes()) );
	}

	getKey() {
        let sec_key = this.secret_key;
        let keymd5 = md5(sec_key);
        let keymd5last12 = keymd5.substr(-12);

        let seckeyadjusted = sec_key.replace('FLWSECK-', '');
        let seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);

        return seckeyadjustedfirst12 + keymd5last12;
	}

	initiatePayment(card_details) {
		return new Promise((resolve, reject) => {
			let encrypted_card_details = this.encryptCardDetails(card_details);
			let payment_options = Object.assign({}, options);
			payment_options.url = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/charge';
			payment_options.body.client = encrypted_card_details;
            payment_options.method = 'POST';
            payment_options.body.PBFPubKey = this.public_key; // set public key

			request(payment_options)
				.then((result) => {
					resolve(result);
				}).catch((err) => {
					reject(err);
				});
			})
	}
}
function flutterWavePayment(number){

var rave = new Rave(process.env.FLUTTERWAVE_PUBLIC_KEY,process.env.FLUTTERWAVE_SECRECT_KEY);

rave.initiatePayment({
  "PBFPubKey": "FLWPUBK-17f5ba05cb29a81a4522235b12292422-X",
  "currency": "KES",
  "country": "KE",
  "amount": "2",
  "phonenumber": number,
  "email": "njine10@gmail.com",
  "firstname": "Gibson",
  "lastname": "Munene",
  "IP": "197.237.174.249",
  "narration": "funds payment",
  "txRef": "jw-222",
  "meta": [{metaname: "extra info", metavalue: "a pie"}],
  "payment_type": "mpesa",
  "is_mpesa": 1,
  "is_mpesa_lipa": 1,
  "is_mocked": false 

  }).then(result => console.log(result))
    .catch(error => console.log(error));
}

module.exports={
    flutterWavePayment
}