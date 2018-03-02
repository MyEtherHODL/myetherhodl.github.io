/* ------------ HOLD ------------ */
$('.promo__btn').filter('.hold').click(function(){
	$('.modal__radio').show();
	
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
	$('.send .modal__status :nth-child(2)').html(web3.eth.defaultAccount);
		
	if(wallet_type == WALLETS[1] || check_wallet_type == WALLETS[1]){
		web3.eth.sendTransaction({ 'from':web3.eth.defaultAccount, 'to': CONTRACT_ADDRESS, 'data': get_kessak256_data(TERMS[$('[name="wallet_term"]:checked').attr('id')])/*, gas:85000*/}, function(err, txHash){
			if(err){
				$('.send .modal__status').hide();
				$('.send .modal__status :nth-child(2)').html('');
			} else {
				console.log(txHash);
				$('.send .modal__status').addClass('success');
				$('.send .modal__status .modal__status-str').html('SUCCESS: ');
				$('.send .modal__status :nth-child(2)').html('<span id="hold_txHash" class="addr__link">'+txHash+'</span>');
				$('#hold_txHash').on('click', function(){
					console.log("https://ropsten.etherscan.io/tx/"+$(this).html());
					window.open("https://ropsten.etherscan.io/tx/"+$(this).html(), '_blank');
				});
			}
		});
	}
}
