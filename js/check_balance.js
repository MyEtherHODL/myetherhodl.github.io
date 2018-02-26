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
	var address = $('#check_withdraw_address').val();
	$('#withdraw_address').val(address);
	$('#withdraw_address').attr('disabled', true);

	var hodler = get_hodler_info(address);
	update_hodler_info(hodler);
});

$('.modal__btn').filter('.send-more-btn').click(function(){
	$('#contract_address').html('').append( CONTRACT_ADDRESS );
	$('[name="wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this).attr('id'));
	});
});