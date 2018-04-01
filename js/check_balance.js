/* ------------ CHECK MY BALANCE ------------ */ /* ------------ SEND MORE ------------ */
$('.descr__link').filter('.check-balance-btn').click(function(){
	$('.modal__radio.type').show();
	$('#check_address').mask("******************************************", { placeholder: " " });
	$('[name="check_wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_type_wallet_check($(this));
	});
});

$('[name="check_wallet_type"]').on('change', function(){
	clearTimeout(check_mist_timeout);
	clearTimeout(check_ledger_timeout);

	check_type_wallet_check($(this));
});

$('.check-bal-btn').on('click', function(){
	if($('#check_address').val().length != 42){
		$('#check_address').fadeTo(100, 0.1).fadeTo(200, 1.0);
	} else {
		$('.modal__radio.type').hide();
		var address = $('#check_address').val();
		$('#check_withdraw_address').val(address);
		$('#check_withdraw_address').attr('disabled', true);
		var hodler = get_hodler_info(address);
		update_hodler_info(hodler);
	}
});

$('.modal__btn').filter('.withdraw-now-btn').click(function(){
	$('.withdraw-bal-btn').hide();
	$('.withdraw .modal__details').show();
	$('.withdraw .modal__status').hide();
	$('.withdraw .modal__status').removeClass('success');
	$('.withdraw .modal__status .modal__status-str').html('PENDING: ');

	if($('[name="check_wallet_type"]:checked').attr('id').split('check_')[1] == WALLETS[2]){
		$('.withdraw-bal-btn-metamask').hide();
		$('.withdraw .modal__fee').show();
		$('.withdraw .modal__manually').show();
	} else {
		$('.withdraw-bal-btn-metamask').show();
		$('#withdraw_address').parent().show();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
		$('.withdraw .modal__mist').hide();
	}

	var address = $('#check_withdraw_address').val();
	$('#withdraw_address').val(address);
	$('#withdraw_address').attr('disabled', true);

	var hodler = get_hodler_info(address);
	update_hodler_info(hodler);
});

$('.modal__btn').filter('.send-more-btn').click(function(){
	show_form_hold_manually(true);
	$('#wallet_manually').attr('checked', true);
	$('#contract_address').html('').append( CONTRACT_ADDRESS );

	if($('[name="check_wallet_type"]:checked').attr('id').split('check_')[1] == WALLETS[2]){
		$('.send .modal__manually').show();
		$('.send .modal__account').hide();
		fill_manually_data_hold();
	} else {
		$('.send .modal__manually').hide();
		$('.send .modal__account').show();
		$('#eth_amount').val('');
	}


	// если текущий контракт на 2 года, то убираем checkbox = 2 years
	// если текущий контракт на 3 года, то убираем checkbox = 3 years
	var address = $('#check_withdraw_address').val();
	var hodler = get_hodler_info(address);
	$('[name="wallet_term"]').each(function(){
		if(parseInt($(this).val()) < hodler.term){
			$(this).parent().css('display', 'none');
		}
		if(parseInt($(this).val()) > hodler.term){
			$(this).parent().css('display', 'block');
			var year = " year";
			if($(this).val() > 1)
				year += "s";
			$("label[for='"+$(this).attr("id")+"']").html($(this).val()+year);
		}
		if(parseInt($(this).val()) == hodler.term){
			if(parseInt($(this).val()) == 1)
				$('#wallet_one_year + label').html('Current term');
			if(parseInt($(this).val()) == 2)
				$('#wallet_two_year + label').html('Current term');
			if(parseInt($(this).val()) == 3)
				$('#wallet_three_year + label').html('Current term');
			$(this).attr('checked', true);
			fill_manually_data_hold();
		}
	});
});

function check_type_wallet_check(wallet_type_el){
	if(wallet_type_el.attr('id').split('check_')[1] != WALLETS[2]){
		show_form_check_manually(false)
		check_wallet(wallet_type_el, 'check');
	} else {
		show_form_check_manually(true);
	}
}
function show_form_check_manually(is_manually){
	if(is_manually){
		$('.check .modal__manually').show();
		$('#check_address').val('');
		$('#check_address').attr('disabled', false);
	} else {
		$('.check .modal__manually').hide();
		$('#check_address').attr('disabled', true);
	}
}
