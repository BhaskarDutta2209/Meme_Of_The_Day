import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Meme from '../abis/Meme.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io', port:5001,protocol:'https'})

const accessIPFS = 'https://ipfs.infura.io/ipfs/'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      privateKey:'',
      buffer: null,
      url : ''
    }
  }

  async componentWillMount() {
    await this.loadBlockchainData()
  }


  async loadBlockchainData() {
    const ganache_url = 'HTTP://127.0.0.1:7545'
    const web3 = new Web3(ganache_url)
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      console.log("This part is working")

      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi,address)
      this.setState({contract})
      const memeHash = await contract.methods.get().call()
      this.setState({url:accessIPFS+memeHash})
    }
    else
      window.alert("Smart contract not deployed in this network")
  }

  onSubmit = (event)=>{
    event.preventDefault()
    ipfs.add(this.state.buffer,(error,result)=>{
      if(error)
        console.error(error)
      else
      {
        var memeHash = result[0].hash
        this.setState({url:accessIPFS+memeHash})
      }
      this.state.contract.methods.set(memeHash).send({from:this.state.account}).then((r)=>{
        return this.setState({memeHash:result[0].hash});
      })
    })
  }

  captureFile = (event)=>{
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = ()=>{
      this.setState({buffer:Buffer(reader.result)})
    }
  }

  captureAccount = (event)=>{
    event.preventDefault()
    this.setState({account:event.target.value})
  }

  capturePrivateKey = (event)=>{
    event.preventDefault()
    this.setState({privateKey:event.target.value})
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            href=""
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            rel="noopener noreferrer"
          >
            Meme of the day
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <img src={this.state.url} />
                <h1>Change Meme</h1>
                <form method = "post" onSubmit={this.onSubmit}>
                  <input type="file" onChange ={ this.captureFile }/>
                  <br />
                  <input type="text" onChange={this.captureAccount}/>
                  <br />
                  <input type="password" onChange={this.capturePrivateKey} />
                  <br />
                  <input type="submit" />
                  <br />
                </form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
