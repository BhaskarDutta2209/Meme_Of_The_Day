pragma solidity ^0.5.0;

contract Meme {
	string memeHash;

	constructor() public {
		memeHash = '';
	}

	function set(string memory _memeHash) public {
		memeHash = _memeHash;
	}

	function get() public view returns(string memory) {
		return memeHash; 
	}
}
