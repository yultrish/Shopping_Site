window.addEventListener('load', async () => { // Fetch all cart items for this customer
    let customerId = localStorage.getItem('customer_id');
    console.log("customer id");
    console.log(customerId);

// Fetch customer information
// let customerId = localStorage.getItem('customer_id');
if (customerId > 0) {
    let rs = await fetch(`http://localhost:7070/shop/v1/customer/${customerId}`);
    if (rs.status === 200) {
        const customerData = await rs.json();
        populateAddress(customerData);
    } else { // Handle the case where the response is not 200 (e.g., error handling)
        console.error('Failed to fetch customer information. Status:', rs.status);
    }
}



    if (customerId > 0) {
        let rs = await fetch('http://localhost:7070/shop/v1/orderWithCustomerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(
                {customer_id: customerId}
            )
        });

        if (rs.status == 200) {
            const checkContainer = document.querySelector('.tbody');
            const orders = await rs.json();
            console.log(orders);

            // Loop through orders and add them to the cart
            orders.forEach(order => {
                const checkItem = document.createElement('tr');
                checkItem.innerHTML = `
                    <td>${
                    order.products.name
                }</td>
                    <td align="right" class='Itemprice'>GHC${
                    order.products.price.toFixed(2)
                }</td>
                `;

                checkContainer.appendChild(checkItem);
            });

            // Calculate and display total prices
            calculateTotalPrice(orders);
        }
    }

    
});



function calculateTotalPrice() {
    Subtotal = document.querySelector('.sub-total')
    total = document.querySelector('.total')

    const Itemprices = document.querySelectorAll('.Itemprice');
    console.log(Itemprices);

    // Initialize an array to store the prices
    const prices = [];

    // Loop through each price element and extract the price
    Itemprices.forEach(price => {
        const priceText = price.textContent;
        const numericPart = priceText.split(/[^0-9.]+/).join(''); // Extract numeric part
        prices.push(parseFloat(numericPart));
    });

    console.log(prices);
    // This will give you an array of prices

    // Calculate the total price using reduce
    const taxRate = 0.2
    const tax = document.querySelector('.tax')
    const totalPrice = prices.reduce((total, price) => total + price, 0);
    console.log(totalPrice); // This will give you the total price
    Subtotal.innerHTML = `GHC${
        totalPrice.toFixed(2)
    }`
    console.log(total)
    totalTax = taxRate * totalPrice
    tax.innerHTML = `GHC${
        totalTax.toFixed(2)
    }`
    console.log(tax)
    net = totalPrice - totalTax
    total.innerHTML = `GHC${
        net.toFixed(2)
    }`


    // Update the total price in the HTML
    const totalPrices = document.querySelectorAll('.sub-total');
    totalPrices.forEach(totalPriceElement => {
        totalPriceElement.textContent = `GHC${
            totalPrice.toFixed(2)
        }`;
    });
}


function populateAddress(customerData) {
    const addressElement = document.querySelector('.card address');

    if (customerData) {
        const {name, city} = customerData;
        addressElement.innerHTML = `
            ${name}<br />
            
            ${city} 
        `;
    }
}

const buyNowButton = document.getElementById('buy-now-button');

buyNowButton.addEventListener('click', async (e) => {
    e.preventDefault()
        try {
            let customerId = localStorage.getItem('customer_id');

            const response = await fetch(`http://localhost:7070/shop/v1/clear-cart/${customerId}`, {
                method : 'DELETE',
                headers : {
                    'Content-Type': 'application/json'
                }

            });

            if (response.status === 200) { // Cart cleared successfully
                alert('Cart cleared successfully!');

                // Redirect to the cart page or update the UI as needed
                window.location.href = 'index.html';
            } 
        } catch (error) {
            console.error(error);
            alert('An error occurred while clearing the cart.');
        }
    
});




