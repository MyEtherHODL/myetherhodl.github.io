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
		
		$('.withdraw .modal').css('height', '450');

		$('.withdraw .modal__details').hide();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
	} else {
		$('.withdraw .modal').css('height', '600');

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
	
	$('.withdraw .modal').css('height', '450');
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
	
	if(is_manually){
		$('.withdraw .modal__field').show();
		$('.withdraw .withdraw-bal-btn').show();
		$('.withdraw .modal').css('height', '450');
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
