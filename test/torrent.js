const test = require('brittle')
const { seed } = require('../src/torrent')

test('seed torrent', async ({ ok, teardown }) => {
    const { torrent, client } = await seed('/tmp/test.txt')
    teardown(async () => {
        await client.destroy()
    ok(torrent)
})
