App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
	  
    // Initialize web3 and set the provider to the testRPC / Metamask.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
	  
    } else {
      // set the provider you want from Web3.providers
	  $("#metamask").html("Pleasee Install Metamask url:- <a href='https://metamask.io/' target='_blank'>Install Metamask</a>");
	  //alert("Plesae install Metamask url:- https://metamask.io/");
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io');
      //web3 = new Web3(App.web3Provider);
	 
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('TutorialToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TutorialTokenArtifact = data;
      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);

      // Set the provider for our contract.
      App.contracts.TutorialToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
	   
      return App.getBalances();
	
    });
	return App.render();
    return App.bindEvents();
	
  },
  
  


  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },
  
  render: function() {
    
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
	web3.version.getNetwork((err, netId) => {
  switch (netId) {
    case "1":
      console.log('This is mainnet')
	  $("#network").html("You are Connected MainNet ");
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
	  $("#network").html("You are Connected MainNet ");
      break
    case "3":
      console.log('This is the Ropsten Network.')
	  $("#network").html("You are Connected Ropsten Network ");
	  content.show();
	  loader.hide();
	   return App.bindEvents();
      break
	   case "4":
	   console.log('This is the Rinkeby test network.')
	  $("#network").html("You are Connected Rinkeby Network ");
	   break
    default:
      console.log('This is an unknown network.')
	  $("#network").html("This is an unknown network.");
  }
});
	
	
	
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
		console.log("account  :"+account);
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
	amount = amount*100;
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.transfer(toAddress, amount, {from: account, gas: 54792});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
	console.log(accounts[0]);
      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
	console.log(result);
        balance = result.c[0]/100;
		balance = balance.toFixed(2);
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
