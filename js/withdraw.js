/* ------------ WITHDRAW ------------ */
$('.promo__btn').filter('.withdraw').click(function(){
	$('.modal__radio').show();
	$('#withdraw_address').attr('disabled', false);

	$('#withdraw_address').html('').append( CONTRACT_ADDRESS );
	$('[name="withdraw_wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this));
	});
	$('#withdraw_address').mask("******************************************", { placeholder: " " });
	$('#withdraw_address').val('');
	$('#withdraw_data').html('').append( get_kessak256_data('party()') );
	$('#withdraw_contract_address').html('').append( CONTRACT_ADDRESS );
	update_hodler_info();

	$('.withdraw .modal__details').hide();
	$('.withdraw .modal__fee').hide();
	$('.withdraw .modal__manually').hide();
	$('.withdraw .modal').css('height', '350');
});

$('#withdraw_address').on('change', function(){
	if($('#withdraw_address').val().length == 0){
		$('.withdraw .modal').css('height', '350');

		$('.withdraw .modal__details').hide();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
	} else {
		$('.withdraw .modal').css('height', '600');

		var hodler = get_hodler_info($(this).val());
		update_hodler_info(hodler);
		$('.withdraw .modal__details').show();
		$('.withdraw .modal__fee').show();
		$('.withdraw .modal__manually').show();
	}
});

$('[name="withdraw_wallet_type"]').on('change', function(){
	if($(this).attr('id').split('withdraw_')[1] != WALLETS[2]){
		$('.withdraw .modal__field').hide();
		$('.withdraw .modal__details').hide();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
		
		$('.withdraw .modal').css('height', '300');

		check_wallet($(this));
	} else {
		$('.withdraw .modal__field').show();
		$('#withdraw_address').val('');
		$('.withdraw .modal').css('height', '350');
	}
});

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
