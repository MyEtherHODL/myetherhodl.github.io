const CONTRACT_ADDRESS = '0xcc277a6925FDc13b6441c0bC40633f481b0A5De4'; //'0x4222Ab28A07E918D9F82c2B3aCa0a42102184D46'; //ropsten
const CREATE_CONTRACT_BLOCK = 2757685;
const ABI = [{"constant":false,"inputs":[{"name":"hodler","type":"address"}],"name":"partyTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hodlersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"get2","outputs":[{"name":"hodler1","type":"address"},{"name":"balance1","type":"uint256"},{"name":"lockedUntil1","type":"uint256"},{"name":"lockedFor1","type":"uint256"},{"name":"hodler2","type":"address"},{"name":"balance2","type":"uint256"},{"name":"lockedUntil2","type":"uint256"},{"name":"lockedFor2","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"party","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor3y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor2y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"hodlFor1y","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"indexOfHodler","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hodlers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lockedUntil","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"loser","type":"address"}],"name":"recoverLost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"get1","outputs":[{"name":"hodler1","type":"address"},{"name":"balance1","type":"uint256"},{"name":"lockedUntil1","type":"uint256"},{"name":"lockedFor1","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"get3","outputs":[{"name":"hodler1","type":"address"},{"name":"balance1","type":"uint256"},{"name":"lockedUntil1","type":"uint256"},{"name":"lockedFor1","type":"uint256"},{"name":"hodler2","type":"address"},{"name":"balance2","type":"uint256"},{"name":"lockedUntil2","type":"uint256"},{"name":"lockedFor2","type":"uint256"},{"name":"hodler3","type":"address"},{"name":"balance3","type":"uint256"},{"name":"lockedUntil3","type":"uint256"},{"name":"lockedFor3","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lockedFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"untilTime","type":"uint256"},{"indexed":false,"name":"duration","type":"uint256"}],"name":"Hodl","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"duration","type":"uint256"}],"name":"Party","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hodler","type":"address"},{"indexed":true,"name":"amount","type":"uint256"},{"indexed":false,"name":"elapsed","type":"uint256"}],"name":"Fee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}];
var ROPSTEN = 0;
var chainId = 1;
ROPSTEN ? ROPSTEN = "ropsten." : ROPSTEN = "";
ROPSTEN ? chainId = 3 : chainId = 1;

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

const INFURA_URL = "https://ropsten.infura.io/BD2Tl5GWNlBNG0PB90dB";
const WALLETS = ['wallet_ledger', 'wallet_mist', 'wallet_manually'];
const TERMS = {'wallet_one_year': 'hodlFor1y()', 'wallet_two_year': 'hodlFor2y()', 'wallet_three_year': 'hodlFor3y()'};
const COUNT_LATEST_HOLDERS = 6;
const COUNT_TOP_HOLDERS = 5;

var web3_local = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
if(!web3_local.net.listening){
	alert('Provider infura.io is not available');
}

load_transactions();

$('.ticker__link').click(function(){
	window.open("https://"+ROPSTEN+"etherscan.io/tx/"+$('#ticker_tx').html(), '_blank');
});

$('#contract_source').click(function(){
	window.open("https://etherscan.io/address/0xcc277a6925fdc13b6441c0bc40633f481b0a5de4#code", '_blank');
});

function get_hodler_info(address){
	var balance = web3_local.eth.contract(ABI).at(CONTRACT_ADDRESS).balanceOf(address) / Math.pow(10,18);
	var term = web3_local.eth.contract(ABI).at(CONTRACT_ADDRESS).lockedFor(address);
	var date_return = web3_local.eth.contract(ABI).at(CONTRACT_ADDRESS).lockedUntil(address);
	var date_start_holding = date_return - term;
	var date_now = ~~ (new Date().getTime() / 1000);
	return {'balance': balance, 'term': term/60/60/24/365, 'date_start_holding': getDateTime(date_start_holding), 'date_return': getDateTime(date_return), 'days_left': ~~ ((date_return - date_now)/60/60/24)};
}

function fill_last_and_top_txs(){
	var hodlers = [];
	var already_hold = 0;
	var biggest_hodler_week = {'balance': 0, 'address': CONTRACT_ADDRESS};
	for(var i = 0; i < web3_local.eth.contract(ABI).at(CONTRACT_ADDRESS).hodlersCount(); i++){
		var address = web3_local.eth.contract(ABI).at(CONTRACT_ADDRESS).hodlers(i);
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
	for(var i = hodlers.length-1; /*hodlers.length-1 - COUNT_LATEST_HOLDERS,*/ i >= 0; i--){
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

var tx_load = { 'Hold':{ 'status': false, 'data':null }, 'Party':{ 'status': false, 'data':null } };
function load_transactions(){
	var engine = new ZeroClientProvider({
	  getAccounts: function(){},
	  rpcUrl: INFURA_URL,
	});

	var option = {
	  address: CONTRACT_ADDRESS,
	  fromBlock: CREATE_CONTRACT_BLOCK,
	  toBlock: 'latest'
	};

	var web3_tx_hold = new Web3(engine);
	web3_tx_hold.eth.contract(ABI).at(CONTRACT_ADDRESS).Hodl({}, option).get(function (err, result) {
		if(!err){
			tx_load.Hold.status = true;
			tx_load.Hold.data = result;
			delete web3_tx_hold;
			fill_last_and_top_txs_v2();
		}
	});
	var web3_tx_party = new Web3(engine);
	web3_tx_party.eth.contract(ABI).at(CONTRACT_ADDRESS).Party({}, option).get(function (err, result) {
		if(!err){
			tx_load.Party.status = true;
			tx_load.Party.data = result;
			delete web3_tx_party;
			fill_last_and_top_txs_v2();
		}
	})
}
function fill_last_and_top_txs_v2(){
	if(tx_load.Hold.status && tx_load.Party.status){
		var tx = tx_load.Hold.data.concat(tx_load.Party.data);
		tx.sort(function(a,b){ return b.blockNumber-a.blockNumber })

		var contract_balance = web3_local.eth.getBalance(CONTRACT_ADDRESS).toNumber() / Math.pow(10,18);

		var withdraw_hodlers = [];
		var biggest_hodler_week;
		var hodlers = [];
		for(var i = 0; i < tx.length; i++){
			var inc_dec = "";
			var term = tx[i].args.duration/365/24/60/60;
			var amount = tx[i].args.amount.toNumber()/Math.pow(10,18);
			var untilTime = "";
			var hodler = tx[i].args.hodler;

			if(tx[i].event == "Party"){
				inc_dec = "decrease";
				amount = "-"+amount;
				withdraw_hodlers.push(tx[i].args.hodler);
			} else if(tx[i].event == "Hodl"){
				inc_dec = "increase";
				untilTime = getDateTime( tx[i].args.untilTime.toNumber() );

				if(biggest_hodler_week == undefined){
					biggest_hodler_week = tx[i];
				} else if(biggest_hodler_week.args.amount.toNumber() < tx[i].args.amount.toNumber()){
					biggest_hodler_week = tx[i];
				}

				if(withdraw_hodlers.indexOf(hodler) == -1){
					if(hodlers[hodler] == undefined){
						hodlers[hodler] = {'amount': amount, 'term': term, 'untilTime': untilTime};
					} else {
						hodlers[hodler].amount += amount;
					}
				}
			}
			// LATEST HOLDERS
			var year_text = "year";
			if(term > 1)
				year_text += "s";
			var tooltip	= "eth will be returned</br>in "+term+" "+year_text+" ("+untilTime+")";
			if(inc_dec == "decrease"){
				tooltip = "eth was returned";
			}
			$('.results__latest').append('<div class="results__top-item"><span class="results__top-count '+inc_dec+'" data-tooltip="'+tooltip+'">'+amount+' Eth</span> <span class="addr__link">'+hodler+'</span> <span class="none">'+tx[i].transactionHash+'</span></div>');

		}

		// TOP 5 HOLDERS
		var _hodlers = [];
		for(var key in hodlers){
		  _hodlers.push({'hodler': key, 'info': hodlers[key]});
		}
		for(var i = 0; i < COUNT_TOP_HOLDERS, i < _hodlers.sort(compareAmount).length; i++){
			var year_text = "year";
			if(term > 1)
				year_text += "s";
			var tooltip	= "eth will be returned</br>in "+_hodlers[i].info.term+" "+year_text+" ("+_hodlers[i].info.untilTime+")";
			$('.results__top').append('<div class="results__top-item"><span class="results__top-count increase" data-tooltip="'+tooltip+'">'+_hodlers[i].info.amount+' Eth</span> <span class="">'+_hodlers[i].hodler+'</span></div>');
		}

		init_tooltip();
		// OTHER FIELDS
		var biggest_hodler_week_balance = biggest_hodler_week.args.amount.toNumber() / Math.pow(10,18);
		var biggest_hodler_week_address = biggest_hodler_week.args.hodler;
		var biggest_hodler_week_tx = biggest_hodler_week.transactionHash;
		$('.ticker__link').html('').append(biggest_hodler_week_balance + " eth");
		$('#ticker_address').html('').append(biggest_hodler_week_address);
		$('#ticker_tx').html('').append(biggest_hodler_week_tx);

		$('.results__top > .results__top-title').html('').append('Top '+COUNT_TOP_HOLDERS+' holders');
		$('.results__title').html('').append(contract_balance + " eth");

		$('.results__latest .results__top-item :nth-child(2)').click(function(){
			window.open("https://"+ROPSTEN+"etherscan.io/tx/"+$(this).next().html(), '_blank');
		});
	}
}
function compareAmount(hodlersA, hodlersB) {
  return hodlersB.info.amount - hodlersA.info.amount;
}

function check_wallet(wallet_el, action){
	clearTimeout(check_mist_timeout);
	clearTimeout(check_ledger_timeout);
	
	var t_w = wallet_el.attr('id');
	$('.modal__warning').html('Please login into your ' + wallet_el.val());

	if( t_w == WALLETS[0] || t_w.split('withdraw_')[1] == WALLETS[0] || t_w.split('check_')[1] == WALLETS[0]){
		check_mist_ledger(action, "ledger");
		return;
	}

	if(t_w == WALLETS[1] || t_w.split('withdraw_')[1] == WALLETS[1] || t_w.split('check_')[1] == WALLETS[1]){
		check_mist_ledger(action, "mist");
		return;
	}
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

//-----
var check_mist_timeout;
var check_ledger_timeout;
var eth_ledger;
function check_mist_ledger(action, type){
	if(type == "mist"){
		if(!web3.currentProvider.isMetaMask || web3.eth.defaultAccount == undefined){
			not_mist_ledger(action, type);
		} else {
			is_mist_ledger(action, web3.eth.defaultAccount);
		}
		return;
	}

	if(type == "ledger"){
		comm = ledger.comm_u2f;
		comm.create_async(0, true).then(function(comm) {
			//comm.timeoutSeconds = 1;
			
			eth_ledger = new ledger.eth(comm);
			eth_ledger.getAppConfiguration_async().then(function(result) {
				eth_ledger.getAddress_async("44'/60'/0'/0").then(function(result) {
					console.log(result);
					is_mist_ledger(action, result.address);
				}).fail(function(ex) {
					not_mist_ledger(action, type); 
				});
			}).fail(function(ex) {
				not_mist_ledger(action, type);
			});
		}).fail(function(ex) {
			not_mist_ledger(action, type);
		});
		return;
	}
}

function not_mist_ledger(action, type, check_timeout){
	if(type == "ledger" && $('[name="wallet_type"]:checked').attr('id') != WALLETS[0]){
		//ledger checkout finished, but user has clicked another wallet_type
		return;
	} 
	
	if(action == "hold"){
		$('.send .modal__warning').show();
		$('.send .modal__account').hide();
	}

	if(action == "withdraw"){
		$('.withdraw .modal__warning').show();
		$('.withdraw-bal-btn').hide();
		$('.withdraw .modal__manually').hide();
	}

	if(type == "mist"){
		check_mist_timeout = setTimeout(function(){
			check_mist_ledger(action, type);
		}, 500);	
	}
	if(type == "ledger"){
		check_ledger_timeout = setTimeout(function(){
			check_mist_ledger(action, type);
		}, 500);	
	}
}

function is_mist_ledger(action, address){
	if(action == "hold"){
		$('.send .modal__warning').hide();
		$('.send .modal__account').show();
	}

	if(action == "withdraw"){
		$('.withdraw .modal__warning').hide();
		$('.withdraw .withdraw-bal-btn').hide();
		$('.withdraw .withdraw-bal-btn-metamask').show();
		$('.withdraw .modal__field').show();
		$('.withdraw .modal__details').show();

		$('#withdraw_address').val(address);
		var hodler = get_hodler_info(address);
		update_hodler_info(hodler);
	}

	if(action == "check"){
		$('.check .modal__warning').hide();
		$('.check .modal__manually').show();
		$('#check_address').val(address);
	}
}