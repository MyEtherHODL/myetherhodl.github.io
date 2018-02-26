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
});

$('#withdraw_address').on('change', function(){
	var hodler = get_hodler_info($(this).val());
	update_hodler_info(hodler);
});

$('[name="withdraw_wallet_type"]').on('change', function(){
	if($(this).attr('id').split('withdraw_')[1] != WALLETS[2]){
		$('.withdraw .modal__field').hide();
		$('.withdraw .modal__details').hide();
		$('.withdraw .modal__fee').hide();
		$('.withdraw .modal__manually').hide();
		
		check_wallet($(this));
	} else {
		$('.withdraw .modal__field').show();
		$('.withdraw .modal__details').show();
		$('.withdraw .modal__fee').show();
		$('.withdraw .modal__manually').show();
	}
});

function get_hodler_info(address){
	var balance = web3.eth.contract(ABI).at(CONTRACT_ADDRESS).balanceOf(address) / Math.pow(10,18);
	var term = web3.eth.contract(ABI).at(CONTRACT_ADDRESS).lockedFor(address);
	var date_return = web3.eth.contract(ABI).at(CONTRACT_ADDRESS).lockedUntil(address);
	var date_start_holding = date_return - term;
	var date_now = ~~ (new Date().getTime() / 1000);
	return {'balance': balance, 'term': term/60/60/24/365, 'date_start_holding': getDateTime(date_start_holding), 'date_return': getDateTime(date_return), 'days_left': ~~ ((date_return - date_now)/60/60/24)};
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

function getDateTime(timestamp) {
	var date = new Date();
	if(timestamp != undefined)
		date = new Date(timestamp*1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return day + "/" + month + "/" + year;
}
