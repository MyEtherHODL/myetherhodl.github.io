const CONTRACT_ADDRESS = '0xc35679FB3cFC2d8f0bd6860BeBCB072391D76043';
const ABI = [{"constant":false,"inputs":[{"name":"hodler","type":"address"}],"name":"partyTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hodlersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"party","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor3y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor2y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor1y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"indexOfHodler","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hodlers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lockedUntil","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lockedFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"untilTime","type":"uint256"},{"indexed":false,"name":"duration","type":"uint256"}],"name":"Hodl","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"duration","type":"uint256"}],"name":"Party","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"elapsed","type":"uint256"}],"name":"Fee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}];
const kessak256 = {
    "70a08231": "balanceOf(address)",
    "46205ac3": "hodlFor1y()",
    "3618b290": "hodlFor2y()",
    "35c05ab0": "hodlFor3y()",
    "7a3b1e86": "hodlers(uint256)",
    "1efdebb2": "hodlersCount()",
    "5246b3ee": "indexOfHodler(address)",
    "f9255c64": "lockedFor(address)",
    "9bc289f1": "lockedUntil(address)",
    "8da5cb5b": "owner()",
    "354284f2": "party()",
    "063b1566": "partyTo(address)",
    "f2fde38b": "transferOwnership(address)"
};

const WALLETS = ['wallet_ledger', 'wallet_mist', 'wallet_manually'];
const TERMS = {'wallet_one_year': 'hodlFor1y()', 'wallet_two_year': 'hodlFor2y()', 'wallet_three_year': 'hodlFor3y()'};
const COUNT_LATEST_HOLDERS = 6;
const COUNT_TOP_HOLDERS = 5;

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/BD2Tl5GWNlBNG0PB90dB"));
if(!web3.net.listening){
	alert('Provider infura.io is not available');
}

fill_last_and_top_txs();

$('.results__top-item :nth-child(2)').click(function(){
	window.open("https://etherscan.io/address/"+$(this).html(), '_blank');
});//https://ropsten.etherscan.io/tx/0x7972a3efc8a6c20dddde5c32e9571e3e5bc3f16baaa2e7b8825c795439a221f5

$('.ticker__link').click(function(){
	window.open("https://etherscan.io/address/"+$('#ticker_address').html(), '_blank');
});


function fill_last_and_top_txs(){
 	var hodlers = [];
	var already_hold = 0;
	var biggest_hodler_week = {'balance': 0, 'address': CONTRACT_ADDRESS};
	for(var i = 0; i < web3.eth.contract(ABI).at(CONTRACT_ADDRESS).hodlersCount(); i++){
		var address = web3.eth.contract(ABI).at(CONTRACT_ADDRESS).hodlers(i);
		var hodler = get_hodler_info(address);
		already_hold += hodler.balance;
		hodlers.push({ 'address': address, 'balance': hodler.balance, 'date_start_holding': hodler.date_start_holding, 'term': hodler.term, 'date_return': hodler.date_return });
		
		var date_arr = hodler.date_start_holding.split('/');
		var curret_unixtime = parseInt(new Date().getTime()/1000);
		var hodler_unixtime = parseInt(new Date(parseInt(date_arr[2]),parseInt(date_arr[1])-1,parseInt(date_arr[0])).getTime()/1000);
		if( curret_unixtime - hodler_unixtime < 8*24*60*60 && 
			biggest_hodler_week.balance < hodler.balance){
			biggest_hodler_week = {'balance': hodler.balance, 'address': address };
		}
	}

	$('.ticker__link').html('').append(biggest_hodler_week.balance + " eth"); 
	$('#ticker_address').html('').append(biggest_hodler_week.address);
	$('.results__top > .results__top-title').html('').append('Top '+COUNT_TOP_HOLDERS+' holders');
	$('.results__title').html('').append(already_hold + " eth");
	for(var i = hodlers.length-1; i > hodlers.length-1 - COUNT_LATEST_HOLDERS, i >= 0; i--){
		var year_text = "year";
		if( hodlers[i].term > 1)
			year_text += "s";
		var tooltip	= "eth will be returned</br>in "+hodlers[i].term+" "+year_text+" ("+hodlers[i].date_return+")";

		$('.results__latest').append('<div class="results__top-item"><span class="results__top-count increase" data-tooltip="'+tooltip+'">'+hodlers[i].balance+' Eth</span> <span class="addr__link">'+hodlers[i].address+'</span></div>');
		
	}
	for(var i = 0; i < COUNT_TOP_HOLDERS, i < hodlers.sort(compareBalance).length; i++){
		var year_text = "year";
		if( hodlers[i].term > 1)
			year_text += "s";
		var tooltip	= "eth will be returned</br>in "+hodlers[i].term+" "+year_text+" ("+hodlers[i].date_return+")";

		$('.results__top').append('<div class="results__top-item"><span class="results__top-count" data-tooltip="'+tooltip+'">'+hodlers[i].balance+' Eth</span> <span class="addr__link">'+hodlers[i].address+'</span></div>');
	}
}
function compareBalance(hodlersA, hodlersB) {
  return hodlersB.balance - hodlersA.balance;
}

/*
$('.modal__copy').click(function(){
	var copy_from = $(this).attr("data-clipboard-target");
	var copy_info = $(copy_from).html();
	if(copy_info.split(' ETH').length > 1)
		copy_info = copy_info.split(' ETH')[0];

	alert(copy_info);
});*/

/* ------------ HOLD ------------ */
$('.promo__btn').filter('.hold').click(function(){
	$('#contract_address').html('').append( CONTRACT_ADDRESS );
	$('[name="wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this).attr('id'));
	});
	
});

$('[name="wallet_type"]').on('change', function(){
	if($(this).attr('id') != WALLETS[2])
		check_wallet($(this).attr('id'));
	else 
		fill_manually_data_hold();
});

$('[name="wallet_term"]').on('change', function(){
	if($('[name="wallet_type"]:checked').attr('id') == WALLETS[2])
		fill_manually_data_hold();
});

function check_wallet(t_w){
	if(t_w == WALLETS[0]){
		check_ledger();
		return;
	}
	
	if(t_w == WALLETS[1]){
		check_mist();
		return;
	}
}

function fill_manually_data_hold(){
	$('#data').html('').append( get_kessak256_data(TERMS[$('[name="wallet_term"]:checked').attr('id')]) );
}
function get_kessak256_data(method){
	return Object.keys(kessak256)[Object.values(kessak256).indexOf(method)];
}

/* ------------ WITHDRAW ------------ */
$('.promo__btn').filter('.withdraw').click(function(){
	withdraw_button();
});

function withdraw_button(hodler){
	update_hodler_info(hodler);
	
	$('#withdraw_address').mask("******************************************", { placeholder: " " });
	$('#withdraw_address').on('change', function(){
		var hodler = get_hodler_info($(this).val());
		update_hodler_info(hodler);
	});

	$('[name="withdraw_wallet_type"]').each(function(){
		if($(this).attr('checked'))
			check_wallet($(this).attr('id').split('withdraw_')[1]);
	});

	$('#withdraw_data').html('').append( get_kessak256_data('party()') );
	$('#withdraw_contract_address').html('').append( CONTRACT_ADDRESS );
	$('[name="withdraw_wallet_type"]').on('change', function(){
		if($(this).attr('id').split('withdraw_')[1] != WALLETS[2])
			check_wallet($(this).attr('id').split('withdraw_')[1]);
	});
}

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

/* ------------ CHECK MY BALANCE ------------ */ /* ------------ SEND MORE ------------ */ 
$('.descr__link').filter('.check-balance-btn').click(function(){
	$('#check_withdraw_address').mask("******************************************", { placeholder: " " });	
	$('#check_withdraw_address').on('change', function(){
		var hodler = get_hodler_info($(this).val());
		update_hodler_info(hodler);
	});

	$('.modal__btn').filter('.withdraw-now-btn').click(function(){
		var hodler = get_hodler_info($('#check_withdraw_address').val());
		withdraw_button(hodler);
		$('#withdraw_address').val($('#check_withdraw_address').val());
	});

	$('.modal__btn').filter('.send-more-btn').click(function(){
		$('#contract_address').html('').append( CONTRACT_ADDRESS );
		$('[name="wallet_type"]').each(function(){
			if($(this).attr('checked'))
				check_wallet($(this).attr('id'));
		});
	});
});

//-----
function check_ledger(){
	alert("check_ledger()");
}
function check_mist(){
	alert("check_mist()");
}