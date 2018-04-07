/* ------------ HOLD ------------ */
$('.promo__btn').filter('.hold').click(function(){
	$('.modal__radio').show();
	$('.send .send-btn').prop('disabled', false);
	
	$('#contract_address').html('').append( CONTRACT_ADDRESS );
	$('[name="wallet_type"]').each(function(){
		if($(this).attr('checked')){
			check_type_wallet_hold($(this));
		}
	});
	$('[name="wallet_term"]').each(function(){
		$(this).parent().css('display', 'block');
		var year = " year";
		if($(this).val() > 1)
			year += "s";
		$("label[for='"+$(this).attr("id")+"']").html($(this).val()+year);
	});
	$('#wallet_one_year').attr('checked', true);
	fill_manually_data_hold();
});

$('[name="wallet_type"]').on('change', function(){
	clearTimeout(check_mist_timeout);
	clearTimeout(check_ledger_timeout);
	
	check_type_wallet_hold($(this));
});

$('[name="wallet_term"]').on('change', function(){
	if($('[name="wallet_type"]:checked').attr('id') == WALLETS[2])
		fill_manually_data_hold();
});

function fill_manually_data_hold(){
	$('#data').html('').append( get_kessak256_data(TERMS[$('[name="wallet_term"]:checked').attr('id')]) );
}
function get_kessak256_data(method){
	return Object.keys(kessak256)[Object.values(kessak256).indexOf(method)];
}
function check_type_wallet_hold(wallet_type_el){
	if(wallet_type_el.attr('id') != WALLETS[2]){
		show_form_hold_manually(false)
		check_wallet(wallet_type_el, 'hold');
	} else {
		show_form_hold_manually(true);
		fill_manually_data_hold();
	}
}
function show_form_hold_manually(is_manually){
	$('.send .modal__status').hide();
	$('.send .modal__status').removeClass('success');
	$('.send .modal__status .modal__status-str').html('PENDING: ');
	
	if(is_manually){
		$('.send .modal__account').hide();
		$('.send .modal__manually').show();
		$('.send .modal__warning').hide();
	} else {
		$('.send .modal__account').hide();
		$('.send .modal__manually').hide();
		$('.send .modal__warning').show();
		$('#eth_amount').val('');
	}
}

$('.send .send-btn').on('click', function(){
	if($('#eth_amount').val() == '')
		$('#eth_amount').fadeTo(100, 0.1).fadeTo(200, 1.0);
	else
		hold($('[name="wallet_type"]:checked').attr('id'), $('[name="check_wallet_type"]:checked').attr('id').split("check_")[1]);
		
});

function hold(wallet_type, check_wallet_type){
	$('.send .modal__status').show();
	$('.send .modal__status').removeClass('success');
	$('.send .modal__status .modal__status-str').html('PENDING: ');
	$('.send .send-btn').prop('disabled', true);
		
	if(wallet_type == WALLETS[1] || check_wallet_type == WALLETS[1]){
		$('.send .modal__status :nth-child(2)').html(web3.eth.defaultAccount);
		web3.eth.sendTransaction({ 'from':web3.eth.defaultAccount, 'to': CONTRACT_ADDRESS, 'data': get_kessak256_data(TERMS[$('[name="wallet_term"]:checked').attr('id')]), 'value': $('#eth_amount').val()*Math.pow(10, 18) /*, gas:85000*/}, function(err, txHash){
			if(err){
				after_sendTx_err(err, 'hold');
			} else {
				after_sendTx_success(txHash, 'hold');
			}
		});
	}

	if(wallet_type == WALLETS[0] || check_wallet_type == WALLETS[0]){
		eth_ledger.getAddress_async("44'/60'/0'/0").then(function(result) {
			$('.send .modal__status :nth-child(2)').html(result.address);
			var tx_data = '0x'+get_kessak256_data(TERMS[$('[name="wallet_term"]:checked').attr('id')]);
			
			$.getJSON("https://gasprice.poa.network", function(data) {
				var tx = new ethereumjs.Tx({
					chainId: chainId,
					nonce: web3_local.eth.getTransactionCount(result.address),
			    	gasPrice: data.standard*Math.pow(10, 9),
			    	gasLimit: web3_local.eth.estimateGas({
					    from: result.address,
					    to: CONTRACT_ADDRESS, 
					    value: $('#eth_amount').val()*Math.pow(10, 18),
					    data: tx_data,
					}),
					from: result.address,
					to: CONTRACT_ADDRESS,
					value: $('#eth_amount').val()*Math.pow(10, 18),
					data: tx_data
			    });
				tx.v = strToBuffer(tx._chainId);
				
				eth_ledger.signTransaction_async("44'/60'/0'/0", tx.serialize().toString('hex')).then(function(result) {
					tx.r = addHexPrefix(result.r);
					tx.s = addHexPrefix(result.s);
					tx.v = addHexPrefix(result.v);
					
					web3_local.eth.sendRawTransaction(addHexPrefix(tx.serialize().toString('hex')), (err, hash) => {
						if(err){
							console.log('sendSignedTransaction', err);
							after_sendTx_err(err, 'hold');	
						} else {
							console.log(hash);
							after_sendTx_success(hash, 'hold');			
						}
					});
				}).fail(function(ex) {
					console.log(ex);
					after_sendTx_err(err, 'hold');
				});
			});
		}).fail(function(ex) {
			console.log("Error get address:", ex);
		});
	}
}

function after_sendTx_err(err, action){
	var class_ = "send";
	if(action == "withdraw"){
		class_ = action;
		$('.withdraw .withdraw-bal-btn-metamask').prop('disabled', false);
	} else {
		$('.send .send-btn').prop('disabled', false);
	}

	$('.'+class_+' .modal__status').hide();
	$('.'+class_+' .modal__status :nth-child(2)').html('');
}

function after_sendTx_success(txHash, action){
	var class_ = "send";
	if(action == "withdraw")
		class_ = action;

	$('.'+class_+' .modal__status').addClass('success');
	$('.'+class_+' .modal__status .modal__status-str').html('SUCCESS: ');
	$('.'+class_+' .modal__status :nth-child(2)').html('<span id="'+action+'_txHash" class="addr__link">'+txHash+'</span>');
	$('#'+action+'_txHash').on('click', function(){
		window.open("https://"+ROPSTEN+"etherscan.io/tx/"+$(this).html(), '_blank');
	});
}


