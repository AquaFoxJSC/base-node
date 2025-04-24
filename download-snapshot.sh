Mainnet	Geth	Full	wget https://mainnet-full-snapshots.base.org/$(curl https://mainnet-full-snapshots.base.org/latest)
Mainnet	Reth	Archive	wget https://mainnet-reth-archive-snapshots.base.org/$(curl https://mainnet-reth-archive-snapshots.base.org/latest)


https://mainnet-full-snapshots.base.org/base-mainnet-full-1744973101.tar.zst
https://mainnet-reth-archive-snapshots.base.org/base-mainnet-reth-1745303152.tar.zst

brew install zstd  # for macOS
sudo apt install zstd  # for Ubuntu

curl -L https://mainnet-full-snapshots.base.org/base-mainnet-full-1744973101.tar.zst | zstd -d | tar -xvf -
curl -L https://mainnet-reth-archive-snapshots.base.org/base-mainnet-reth-1745303152.tar.zst | zstd -d | tar -xvf -
