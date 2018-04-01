/* ------------ WITHDRAW ------------ */
$('.promo__btn').filter('.withdraw').click(function(){
	$('.modal__radio').show();
	$('#withdraw_address').attr('disabled', false);

	$('#withdraw_address').html('').append( CONTRACT_ADDRESS );
	$('[name="withdraw_wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_type_wallet_withdraw($(this));
	});
	$('#withdraw_address').mask("******************************************", { placeholder: " " });
	$('#withdraw_data').html('').append( get_kessak256_data('party()') );
	$('#withdraw_contract_address').html('').append( CONTRACT_ADDRESS );
});

$('.withdraw-bal-btn').on('click', function(){
	if($('#withdraw_address').val().length != 42){
		$('#withdraw_address').fadeTo(100, 0.1).fadeTo(200, 1.0);

		$('.withdraw .modal__details').hide();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
	} else {
		var hodler = get_hodler_info($('#withdraw_address').val());
		update_hodler_info(hodler);
		$('.withdraw .withdraw-bal-btn').hide();
		$('.withdraw .modal__details').show();
		$('.withdraw .modal__fee').show();
		$('.withdraw .modal__manually').show();
	}
});


$('[name="withdraw_wallet_type"]').on('change', function(){
	clearTimeout(check_mist_timeout);
	clearTimeout(check_ledger_timeout);

	check_type_wallet_withdraw($(this));
});

function check_type_wallet_withdraw(wallet_type_el){
	if(wallet_type_el.attr('id').split('withdraw_')[1] != WALLETS[2]){
		show_form_withdraw_manually(false)
		check_wallet(wallet_type_el, 'withdraw');
	} else {
		show_form_withdraw_manually(true);
	}
}
function show_form_withdraw_manually(is_manually){
	$('.withdraw .withdraw-bal-btn-metamask').hide();
	$('.withdraw .modal__details').hide();
	$('.withdraw .modal__fee').hide();
	$('.withdraw .modal__manually').hide();

	$('.withdraw .modal__status').hide();
	$('.withdraw .modal__status').removeClass('success');
	$('.withdraw .modal__status .modal__status-str').html('PENDING: ');

	if(is_manually){
		$('.withdraw .modal__field').show();
		$('.withdraw .withdraw-bal-btn').show();
		$('#withdraw_address').val('');
		$('#withdraw_address').attr('disabled', false);
	} else {
		$('.withdraw .modal__field').hide();
		$('#withdraw_address').attr('disabled', true);
	}
}

function update_hodler_info(hodler){
	var balance = '-- ETH';
	var term = '-- year';
	var date_start_holding = '--/--/----';
	var date_return = '--/--/----';
	var days_left = '';

	if(hodler != undefined){
		balance = hodler.balance + ' ETH';
		term = hodler.term + ' year';
		if(term != 1)
			term += 's';
		if(hodler.balance > 0){
			date_start_holding = hodler.date_start_holding;
			date_return = hodler.date_return;
			days_left = '('+hodler.days_left+' days left)';
		}
	}
	$('.modal__details-common > .modal__details-val:nth-child(2)').html('').append(balance);
	$('.modal__details-common > .modal__details-val:nth-child(4)').html('').append(term);
	$('.modal__details-period > .modal__details-val:nth-child(2)').html('').append(date_start_holding);
	$('.modal__details-period > .modal__details-val:nth-child(4)').html('').append(date_return);
	$('.modal__details-days').html('').append(days_left);
}

$('.withdraw .withdraw-bal-btn-metamask').on('click', function(){
	withdraw($('[name="withdraw_wallet_type"]:checked').attr('id').split("withdraw_")[1], $('[name="check_wallet_type"]:checked').attr('id').split("check_")[1]);
});

function withdraw(wallet_type, check_wallet_type){
	$('.withdraw .modal__status').show();
	$('.withdraw .modal__status').removeClass('success');
	$('.withdraw .modal__status .modal__status-str').html('PENDING: ');
	
	if(wallet_type == WALLETS[1] || check_wallet_type == WALLETS[1]){
		$('.withdraw .modal__status :nth-child(2)').html(web3.eth.defaultAccount);
		web3.eth.sendTransaction({ 'from':web3.eth.defaultAccount, 'to': CONTRACT_ADDRESS, 'data': get_kessak256_data('party()'), 'value': 0 /*, gas:85000*/}, function(err, txHash){
			if(err){
				after_sendTx_err(err, 'withdraw');
			} else {
				after_sendTx_success(txHash, 'withdraw');
			}
		});
	}

	if(wallet_type == WALLETS[0] || check_wallet_type == WALLETS[0]){
		eth_ledger.getAddress_async("44'/60'/0'/0'/0").then(function(result) {
			$('.withdraw .modal__status :nth-child(2)').html(result.address);
			var tx_data = '0x'+get_kessak256_data('party()');
			
			$.getJSON("https://gasprice.poa.network", function(data) {
				var tx = new ethereumjs.Tx({
					chainId: chainId,
					nonce: web3_local.eth.getTransactionCount(result.address),
			    	gasPrice: data.standard*Math.pow(10, 9),
			    	gasLimit: web3_local.eth.estimateGas({
					    from: result.address,
					    to: CONTRACT_ADDRESS, 
					    value: 0,
					    data: tx_data,
					}),
					to: CONTRACT_ADDRESS,
					value: 0,
					data: tx_data
			    });
				tx.v = strToBuffer(tx.chainId);
				
				eth_ledger.signTransaction_async("44'/60'/0'/0'/0", tx.serialize().toString('hex')).then(function(result) {
					tx.r = addHexPrefix(result.r);
					tx.s = addHexPrefix(result.s);
					tx.v = addHexPrefix(result.v);
					
					web3_local.eth.sendSignedTransaction(addHexPrefix(tx.toString('hex'))).then(hash => {
						console.log(hash);
						after_sendTx_success(hash, 'withdraw');		
					}).catch(err => {
						console.log('sendSignedTransaction', err);
						after_sendTx_err(err, 'withdraw');
					});
				}).fail(function(ex) {
					console.log(ex);
					after_sendTx_err(err, 'withdraw');
				});
			});
		}).fail(function(ex) {
			console.log("Error get address:", ex);
		});
	}
}