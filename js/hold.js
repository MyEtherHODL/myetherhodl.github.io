/* ------------ HOLD ------------ */
$('.promo__btn').filter('.hold').click(function(){
	$('.modal__radio').show();
	
	$('#contract_address').html('').append( CONTRACT_ADDRESS );
	$('[name="wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this));
	});
});

$('[name="wallet_type"]').on('change', function(){
	if($(this).attr('id') != WALLETS[2])
		check_wallet($(this));
	else 
		fill_manually_data_hold();
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
