var pet_prices = [];
var user_account = null;
App = {
  web3Provider: null,
  contracts: {},
  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {

      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 1; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Adoption.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    web3.eth.getAccounts(function (error, accounts) {
      user_account = accounts[0];
      setInterval(function(){ App.markAdopted() }, 3000);
    });
    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-buy-dog-coin', App.handleBuyDogCoin);
  },

  markAdopted: function (adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] === user_account) {
          var buttonText =  "You own";
          $('.panel-pet').eq(i).find('button').text(buttonText).attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;

      return adoptionInstance.getPrices.call();
    }).then(function (prices) {
      pet_prices = prices;
      for (i = 0; i < prices.length; i++) {
        $('.panel-pet').eq(i).find('.pet-price').text(web3.fromWei(prices[i], "ether") + " Dog Coin");

      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleBuyDogCoin: function(event) {
    event.preventDefault();

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      user_account = account;

      App.contracts.Adoption.deployed().then(function (instance) {
        buyDogCoin = instance;
        return buyDogCoin.buyDogToken({
          from: account,
          value: 100000000000000000
        }).then(function (result) {
          console.log("result: ");
          console.log(result);
        }).catch(function (err) {
          console.log("error: ");
          console.log(err.message);
        });
      }).then(function (result) {
        console.log("result: ");
        console.log(result);
      }).catch(function (err) {
        console.log("error: ");
        console.log(err.message);
      });
    });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      user_account = account;

      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        console.log("application has been deployed");
        console.log(adoptionInstance);
        return adoptionInstance.adopt(petId, {
          from: account
          // value: pet_prices[petId]
        }).then(function (result) {
          console.log("result: ");
          console.log(result);
          return App.markAdopted();
        }).catch(function (err) {
          console.log("error: ");
          console.log(err.message);
        });
      }).then(function (result) {
        console.log("result: ");
        console.log(result);
        return App.markAdopted();
      }).catch(function (err) {
        console.log("error: ");
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
