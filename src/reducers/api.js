class Api {
    constructor() {
        this.url = 'https://localhost:5000';
    }

    get = async (path) => {
        const response = await fetch(`${this.url}/${path}`);
        return response.json();
    }

    post = async (path, data) => {
        const response = await fetch(`${this.url}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    delete = async (path) => {
        const response = await fetch(`${this.url}/${path}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    getAbi = async () => {
        return this.get('abi');
    }

    talk = async (message, chainId) => {
        // on this talk user sends arbitrary data to back end
        // {
        //     'to': '0xblahblahblahblahblah'
        //     'calldata': '0x1238291372819378291372891321932132132132131231231232131'
        //     'chainid': 1
        // }
        console.log("chaindId", chainId)
        this.post('json', { message, chainId })
            .then(response => {
                console.log(response);
                if (!response.to || !response.calldata) {
                    console.error('Invalid response from server');
                    return;
                }
                return response;
            })
            .catch(error => console.error(error));
    }
}

export default Api;