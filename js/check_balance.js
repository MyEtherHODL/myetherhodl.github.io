/* ------------ CHECK MY BALANCE ------------ */ /* ------------ SEND MORE ------------ */ 
$('.descr__link').filter('.check-balance-btn').click(function(){
	$('.modal__radio.type').show();
	$('#check_address').mask("******************************************", { placeholder: " " });	
	$('#check_address').val('');	
	$('[name="check_wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this));
	});
});

$('[name="check_wallet_type"]').on('change', function(){
	if($(this).attr('id').split('check_')[1] != WALLETS[2]){
		check_wallet($(this));
	} 
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
	$('.withdraw .modal').css('height', '600');
	$('.withdraw .modal__details').show();
	$('.withdraw .modal__fee').show();
	$('.withdraw .modal__manually').show();
	
	var address = $('#check_withdraw_address').val();
	$('#withdraw_address').val(address);
	$('#withdraw_address').attr('disabled', true);

	var hodler = get_hodler_info(address);
	update_hodler_info(hodler);
});

$('.modal__btn').filter('.send-more-btn').click(function(){
	show_form_wallet(true);
	$('#wallet_manually').attr('checked', true);

	$('#contract_address').html('').append( CONTRACT_ADDRESS );
	fill_manually_data_hold();
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
			if(parseInt($(this).val()) == 2)
				$('#wallet_two_year + label').html('Current term');
			if(parseInt($(this).val()) == 3)
				$('#wallet_three_year + label').html('Current term');
			$(this).attr('checked', true);
			fill_manually_data_hold();
		}
	});

});