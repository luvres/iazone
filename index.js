const functions = require('firebase-functions');
const cheerio = require('cheerio');
const request = require('request');
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


// descobrirProduto.get({ qs:{ ean:"7897424081387" } });
// descobrirProduto.get().form( {ean: '7897424081387' });
// firebase experimental:functions:shell
// lsof -Pn -i4
// kill -9 2893

exports.descobrirProduto = functions.https.onRequest((req, resp) => {
	const params = req.body;
	let obj = {};
	let produto = {};

	for (const key in req.query) {
		obj[key] = req.query[key];
	}

	params['querystring'] = obj;
	let ean = obj.ean || params.ean;
	let url_base = "https://cosmos.bluesoft.com.br/produtos/";
	let request_url = url_base + ean

	var options = {
		uri: request_url,
		method: 'GET'
	};

	request(options, function (error, response, body) {
		// console.log(response);
		// console.log("ean",params);

		if (!error && response.statusCode == 200) {
			//console.log(html);
			let $ = cheerio.load(body);
			let interest_content = $('.page-header');
			// var img = interest_content.find('img').attr('data-cfsrc');
			// console.log(url_base+img);

			produto['nome'] = interest_content.contents().first().text();
			let thumbnail = $('div.product-thumbnail');
			let thumbnail_img = thumbnail.find('img').attr('data-cfsrc') || thumbnail.find('img').attr('src')

			produto['imagem'] = thumbnail_img;
			params['produto'] = produto;
			resp.json(params);
		}
	});


});