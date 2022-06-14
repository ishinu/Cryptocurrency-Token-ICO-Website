App = {
    web3Provider:null,
    contracts: {},
    account: '0x0',
    loading:false,
    tokenPrice:1000000000000000,
    tokensSold: 0,
    tokensAvailable:750000,

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },
    initWeb3:function(){
        if(typeof web3 !== 'undefined') {
            //If a web3 instance is already provided by Meta Mask.
            App.web3Provider= window.ethereum;
            web3= new Web3(window.ethereum);
        } else{
            //Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3= new Web3(App.web3Provider);
        }
        return App.initContracts();
    },
    initContracts: function(){
        $.getJSON("EPICTokenSale.json",function(EPICTokenSale){
            App.contracts.EPICTokenSale= TruffleContract(EPICTokenSale);
            App.contracts.EPICTokenSale.setProvider(App.web3Provider);
            App.contracts.EPICTokenSale.deployed().then(function(EPICTokenSale){
                console.log("EPIC Token Sale Address : ",EPICTokenSale.address);
            });
        }).done(function(){
                $.getJSON("EPICToken.json",function(EPICToken){
                    App.contracts.EPICToken = TruffleContract(EPICToken);
                    App.contracts.EPICToken.setProvider(App.web3Provider);
                    App.contracts.EPICToken.deployed().then(function(EPICToken){
                        console.log("EPIC Token Address : ",EPICToken.address);
                });

                App.listenForEvents();
                return App.render(); 
            });
        })
    },

    listenForEvents: function(){
        App.contracts.EPICTokenSale.deployed().then(function(instance){
            instance.Sell({}, {
                fromBlock:0,
                toBlock:'latest',
            }).watch(function(error,event){
                console.log("event triggered",event);
                App.render();
            })
        })
    },
    /*
    render: function() { 
        // Load account data
        web3.eth.getCoinbase(function(err,account){
            if(err === null) {
                console.log("account",account);
                App.account= account;
                $('#accountAddress').html("Your Account : "+account);
            }
         });
    } 
    */

    /*
        render:function(){ 
            // New Code
            if(window.ethereum){
                try{
                    const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccounts(accounts);
                    App.account= accounts[0];
                    console.log("Your Account : ",App.account);
                    $("#accountAddress").html("Your Account: " + App.account);
                 } 
                 catch (error) {
                    if (error.code === 4001) {
                      // User rejected request
                    }
                
                    setError(error);
                  }
            } 
        }
    
        render: async function(){ 
            // New Code
            if(window.ethereum){    
            try {
                // Request account access if needed
                const accounts = await ethereum.request('eth_requestAccounts');
                App.account= accounts[0];
                console.log("Your Account : ",App.account);
                $("#accountAddress").html("Your Account: " + App.account);
                // Accounts now exposed, use them
                // ethereum.send('eth_sendTransaction', { from: accounts[0], /* ...  })
            } catch (error) {
                console.log(error);
            }
        }
    }
    */
    render:function(){ 
        if(App.loading){
            return;
        }
        App.loading=true;
        var loader=$('#loader');
        var content=$('#content');

        loader.show();
        content.hide();
        // New Code
        if(window.ethereum){
        ethereum.enable().then(function(acc){
            App.account = acc[0];
            console.log("Your Account : ",App.account);
            $("#accountAddress").html("Your Account: " + App.account);
        })

            App.contracts.EPICTokenSale.deployed().then(function(instance){
                EPICTokenSaleInstance=instance;
                return EPICTokenSaleInstance.tokenPrice();
            }).then(function(tokenPrice){
                App.tokenPrice=tokenPrice;
                console.log("tokenPrice",tokenPrice.toNumber());
                $('.token-price').html(web3.fromWei(App.tokenPrice,"ether").toNumber());
                return EPICTokenSaleInstance.tokensSold();
            }).then(function(tokensSold){
               // App.tokensSold=tokensSold.toNumber();
                App.tokensSold=tokensSold.toNumber();
                $('.tokens-sold').html(App.tokensSold); 
                $('.tokens-available').html(App.tokensAvailable); 

                var progressPercent= (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
                $('#progress').css('width',progressPercent +'%');

                App.contracts.EPICToken.deployed().then(function(instance){
                    EPICTokenInstance=instance;
                    return EPICTokenInstance.balanceOf(App.account);
                }).then(function(balance){
                    $('.epic-balance').html(balance.toNumber());
                    App.loading=false;
                    loader.hide();
                    content.show();
                })
            });
        }
    },

    buyTokens : function(){
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.EPICTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000 
            });
        }).then(function(result){
            console.log("Congratulations!! EPIC Tokens bought!");
            $('form').trigger('reset');
            /*
            $('#loader').hide();
            $('#content').show();
            */
        });
    }
}

$(function(){
    $(window).load(function(){
        App.init();
    })
});