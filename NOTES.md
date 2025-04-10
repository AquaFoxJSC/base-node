Checking synced status

```
echo Latest synced block behind by: $((($(date +%s)-$( \
  curl -d '{"id":0,"jsonrpc":"2.0","method":"optimism_syncStatus"}' \
  -H "Content-Type: application/json" https://baserpc-l2.aquafox.io | \
  jq -r .result.unsafe_l2.timestamp))/60)) minutes
```

Get block number
```
curl -d '{"id":0,"jsonrpc":"2.0","method":"eth_blockNumber"}' \
  -H "Content-Type: application/json" https://baserpc.aquafox.io
```

```
http://ip-172-31-17-107.ap-southeast-1.compute.internal:8545
ws://ip-172-31-17-107.ap-southeast-1.compute.internal:8546
```