const Meme = artifacts.require('Meme')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Meme',(accounts)=>{
	let meme 

	before(async()=>{
		meme = await Meme.deployed()
	})

	describe("deployment",async ()=>{

		it("deployed successfully", async ()=>{
			
			const address = meme.address
			assert.notEqual(address,0x0)
			assert.notEqual(address,'')
			assert.notEqual(address,null)
			assert.notEqual(address,undefined)
		})
	})

	describe("storage",async()=>{
		it("updates the meme hash",async ()=>{
			let memeHash
			memeHash = "abc123"
			await meme.set(memeHash)
			let result = await meme.get()
			assert.equal(result,memeHash)
		})
	})
})