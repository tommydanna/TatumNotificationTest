const subscribeButton = document.getElementById('subscribe');
const listSubscriptionsButton = document.getElementById('listSubscriptions');
const cancelSubscriptionButton = document.getElementById('cancelSubscription');

const statusDiv = document.getElementById('status');
const subscriptionsDiv = document.getElementById('subscriptions');



const apiKey = '4f4ac031-d782-41d9-89f9-0ddcac3b3b82';
const webHook = 'https://webhook.site/b7f969ef-923e-4e40-9bf4-189cc9a91d49';
const region = 'us-west1';

const walletAddress = 'F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV';

function subscribe(walletAddress) {
    fetch(`https://api-${region}.tatum.io/v3/subscription`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            type: 'ADDRESS_TRANSACTION',
            attr: {
                address: walletAddress,
                chain: 'SOL',
                url: webHook,
            },
        }),
    })
        .then((data) => data.json())
        .then((data) => {
            statusDiv.textContent = JSON.stringify(data, null, 2);
        });
}

function listSubscriptions() {
    fetch(`https://api-${region}.tatum.io/v3/subscription?pageSize=10&offset=0`, {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
        },
    })
        .then((data) => data.json())
        .then((subscriptionList) => {
            subscriptionsDiv.innerHTML = '';
            if (subscriptionList.length > 0) {
                for (const subscription of subscriptionList) {
                    const html = `<pre>
                    ${subscription.id}
                    ${subscription.type}
                    ${subscription.attr.address}
                    ${subscription.attr.chain}
                    ${subscription.attr.url}
                    <button onclick="cancelSubscription('${subscription.id}')">Cancel</button>
                    </pre>`;
                    subscriptionsDiv.innerHTML += html;
                }
            } else {
                subscriptionsDiv.innerHTML = 'No Subscriptions';
            }
        });
}

function cancelSubscription(id) {
    fetch(`https://api-${region}.tatum.io/v3/subscription/${id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': apiKey,
        },
    })
        .then((data) => data.json())
        .then((data) => {
            statusDiv.textContent = JSON.stringify(data, null, 2);
        });
}

subscribeButton.addEventListener('click', () => {
    subscribe(walletAddress);
});

listSubscriptionsButton.addEventListener('click', () => {
    listSubscriptions();
});