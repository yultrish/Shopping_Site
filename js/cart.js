window.addEventListener('load', async () => {
    // Fetch all cart items for this customer
    let customerId = localStorage.getItem('customer_id');
    console.log("customer id");
    console.log(customerId);

    if (customerId > 0) {
        // Fetch all orders
        let rs = await fetch('http://localhost:7070/shop/v1/orderWithCustomerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ customer_id: customerId })
        });
        if (rs.status == 200) {
            const cartContainer = document.querySelector('.cart-page table tbody');
            const orders = await rs.json();
            console.log(orders);

            // Loop through orders and add them to the cart
            orders.forEach(order => {
                const cartItem = document.createElement('tr');
                cartItem.innerHTML = `
                    <td>
                        <div class="cart-info">
                            <img src="${order.products.image}" alt="${order.products.name}">
                            <div>
                                <p>${order.products.name}</p>
                                <small>Price: GHC${order.products.price.toFixed(2)}</small>
                                <a href="#" class="btn-outline-danger remove" id="${order.id}">Remove</a>
                            </div>
                        </div>
                    </td>
                    <td class="quantity"><input type="number" value="1" min="1"></td>
                    <td class="Itemprice">GHC${(order.products.price).toFixed(2)}</td>
                `;

                cartContainer.appendChild(cartItem);
            });

            // Calculate and display total prices
            calculateTotalPrice();
            // window.location.href = '../cart.html'
        }
    }

   // Add event listeners to remove items from the cart
const deleteOrder = document.querySelectorAll('.btn-outline-danger');
  deleteOrder.forEach(deletedItem => {
    deletedItem.addEventListener('click', async (e) => {
      e.preventDefault();
      const orderId = deletedItem.getAttribute('id');
      const orderContainer = e.target.parentElement.parentElement.parentElement;
      const quantityElement = orderContainer.querySelector('.quantity'); // Select the quantity element
      const priceElement = orderContainer.querySelector('.Itemprice'); // Select the price element

      try {
        const confirmed = confirm(`Are you sure you want to delete this order with id ${orderId}`);
        if (confirmed) {
          // Apply the firework class for the fading effect
          orderContainer.classList.add('fireworks');

          // Wait for the animation to complete before removing the element
          orderContainer.addEventListener('animationend', () => {
            // Check if the quantity and price elements exist before removing them
            if (quantityElement) {
              quantityElement.remove();
            }
            if (priceElement) {
              priceElement.remove();
            }

            // Remove the deleted item from the DOM
            orderContainer.remove();

            // Recalculate and display total prices
            calculateTotalPrice();
          });

          const result = await fetch(`http://localhost:7070/shop/v1/order/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (result.status === 200 || result.status === 201) {
            const response = await result.json();
            console.log(response);
            console.log("Deleted successfully");
          }

           window.location.href = './cart.html';

        }
      } catch (error) {
        console.error(error);
      }
    });
  });
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

    console.log(prices); // This will give you an array of prices

    // Calculate the total price using reduce
   const  taxRate = 0.2
   const tax = document.querySelector('.tax')
    const totalPrice = prices.reduce((total, price) => total + price, 0);
    console.log(totalPrice); // This will give you the total price
    Subtotal.innerHTML = `GHC${totalPrice.toFixed(2)}`
    console.log(total)
    totalTax = taxRate * totalPrice
    tax.innerHTML = `GHC${totalTax.toFixed(2)}` 
    console.log(tax)
    net = totalPrice - totalTax
    total.innerHTML = `GHC${net.toFixed(2)}`


    // Update the total price in the HTML
    const totalPrices = document.querySelectorAll('.sub-total');
    totalPrices.forEach(totalPriceElement => {
        totalPriceElement.textContent = `GHC${totalPrice.toFixed(2)}`;
    });
}


//declare variable MenuItems which take ul having id "MenuItems"
        
        var MenuItems = document.getElementById("MenuItems");
        MenuItems.style.maxHeight = "0px";//by default, we have set menu or dropdown menu height to 0px, means it is close by default
        
        function menutoggle()//this is the function which we have called above in nav which works on small devices and users click on it
        {
            if (MenuItems.style.maxHeight =="0px")//when user click on it and if it is closed or its height is 0px, then it will open or it should have heigt of 200px upon clicking
            {
                MenuItems.style.maxHeight = "200px"
            }
            else//if user not clicked or it has already opened, then it will upon clicking again closed
            {
                MenuItems.style.maxHeight = "0px" 
            }
        
        }