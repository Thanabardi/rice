import { NFTStorage, Blob } from 'nft.storage'
const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwMWMwQjY3ZDRmMjM4OTM2ZjYxMTI3MDQxQjc5RDU0OGQ4NjEyMDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODMwOTUwOTA1MSwibmFtZSI6InRlc3QifQ.Yv6GxXbPirOLm8mSzxVokQtHP9VglIPswqfKK3IAM0Y" })

async function upload() {
    const reader = new FileReader();
    reader.onloadend = function() {
        const content = new Blob([reader.result])
        const metadata = await client.storeBlob(content)
        console.log(metadata)
    }
}

// main()