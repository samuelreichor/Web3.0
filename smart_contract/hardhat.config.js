//https://eth-ropsten.alchemyapi.io/v2/gwaxYHERyjKqnHv9a916Sj71p47_SGWJ

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten:{
      url: 'https://eth-ropsten.alchemyapi.io/v2/gwaxYHERyjKqnHv9a916Sj71p47_SGWJ',
      accounts: [ 'b45e514b5cb261d66c0a9bf6c511af62b2107cd0d908d970d3f0c9fc04700a4b']
    }
  }
}