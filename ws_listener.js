const WebSocket = require('ws');
const { ethers } = require('ethers');

class WebSocketClient {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            reconnectInterval: 5000,
            maxReconnectAttempts: 10,
            maxRetriesForTxStatus: 10,
            rpcUrl: 'https://base-rpc.publicnode.com',
            ...options
        };
        this.reconnectAttempts = 0;
        this.txRetries = 0;
        this.provider = new ethers.JsonRpcProvider(this.options.rpcUrl);
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            console.log('Connected to WebSocket server');
            this.reconnectAttempts = 0;
        });

        this.ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data);
                // console.log('Received:', message);
                const txHash = message.data.tx_hash;
                // console.log('New Transaction:', txHash);


                await this.checkTxStatus(txHash);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        this.ws.on('close', () => {
            console.log('WebSocket connection closed');
            this.reconnect();
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('pong', () => {
            console.log('Received pong from server');
        });
    }

    async checkTxStatus(txHash) {
        // if (this.txRetries >= this.options.maxRetriesForTxStatus) {
        //     console.error('Max retries reached for transaction status');
        //     return;
        // }

        console.log(`Checking status for txHash: ${txHash}...`);
        try {

            const receipt = await this.provider.getTransactionReceipt(txHash);


            if (receipt && receipt.blockNumber) {
                // console.log(`Transaction ${txHash} mined in block: ${receipt.blockNumber}`);
            } else {
                console.log(`Transaction ${txHash} not mined yet. Retrying...`);
                this.txRetries++;
                setTimeout(() => this.checkTxStatus(txHash), 5000);
            }
        } catch (error) {
            console.error(`Error checking tx status for ${txHash}:`, error);
        }
    }

    reconnect() {
        if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`);

            setTimeout(() => {
                this.connect();
            }, this.options.reconnectInterval);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

const client = new WebSocketClient('ws://localhost:8080/ws', {
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    maxRetriesForTxStatus: 10,
    rpcUrl: 'https://base-rpc.publicnode.com'
});

process.on('SIGINT', () => {
    console.log('Closing WebSocket connection...');
    client.close();
    process.exit();
});
