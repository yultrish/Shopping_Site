// localStorage.removeItem('customer_token')
// localStorage.removeItem('customer_id')
    let cartCount = 0;
  window.addEventListener('load', async () => {

            // Make a GET request to your API endpoint
            const apiUrl = 'http://localhost:7070/shop/v1/products';

            
                const response = await fetch(apiUrl);
                const products = await response.json();

                    // Populate the product container with the received data
                    const productList = document.querySelector('.row');

                    products.forEach(product => {
                        const productItem = document.createElement('div');
                        productItem.classList.add('col-4');
                        productItem.innerHTML = `
                            <img src="${product.image}" alt="${product.name}" />
                            <h4>${product.name}</h4>
                            <div class="rating">
                                ${generateStars(product.rating)}
                            </div>
                            <p class="price">${product.price}</p>
                              <button class="add-to-cart" id=${product.id}>Add to Cart</button>
                        `;

                        productList.appendChild(productItem);
                    

                    
});
    
   // Add event listeners to the "Add to Cart" buttons
    const addToCartBtn = document.querySelectorAll('.add-to-cart');

    addToCartBtn.forEach(btn => {

        // btn.style.border = '1px solid black';

        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Your "Add to Cart" button click logic here
            let product_id = btn.id;
            console.log('product id')
            console.log(product_id)
            console.log("customer_id")

            let customer_id = localStorage.getItem('customer_id');

            console.log(customer_id)
            console.log('product price')
            let mainEL = e.target.parentElement;
            let mainElement = mainEL.parentElement;
            const price = mainElement.querySelector('p.price')
            const priceVal = price.innerHTML;
            console.log(priceVal)



            const newOrder = await fetch('http://localhost:7070/shop/v1/order', {
                method: 'POST',
                headers: {
                    "content-type": "application/json "
                },
                body: JSON.stringify({
                    product_id: Number(product_id),
                    customer_id: Number(customer_id)
                })
            })

            if (newOrder.status == 409) {
                let res = await newOrder.json();
                alert('Product has already been added to cart');
        
                return;
            }

            if (newOrder.status == 200 || newOrder.status == 201) {
                let res = await newOrder.json();
                console.log(res)
            alert('attempting to add new item to shopping cart' + product_id)

            }

            window.location.href = './index.html';

        });
    });

  

             
});



//self invoking function 


    //self invoking function 
const createNewCustomerId = async () => {

    //get customer token
    let customer_token = localStorage.getItem('customer_token');

    if (!customer_token) {
        customer_token = Math.random() + new Date().toLocaleDateString()
        console.log("customer token")
        console.log(customer_token)
        //create new customer

        const url = 'http://localhost:7070/shop/v1/customer';
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: "yultrish",
                city: "Accra",
                token: customer_token
            })
        })

        if (result.status == 200) {
            localStorage.setItem('customer_token', customer_token)
        }

    }
    console.log('customer already created')
}

createNewCustomerId();


const cartNumber = async (customer_token) => {
    console.log("getting cart items list")
    //get cart items number
    // setInterval(() => {
    const result = await fetch('http://localhost:7070/shop/v1/customer-with-token', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            token: customer_token
        })
    })

    if (result.status == 200) {
        let response = await result.json();
        console.log(response)
        console.log("response id")
        const id = response[0].id;
        console.log(id)

        //store customer id in localstorage
        let customer_id = localStorage.getItem('customer_id');

        if (!customer_id) {
            localStorage.setItem('customer_id', id);
        }


        //get orders with customer id 
        const rs = await fetch('http://localhost:7070/shop/v1/orders-with-customerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                customer_id: id
            })

        });

        if (rs.status == 200) {
            let orders = await rs.json();
            console.log(orders)
            const { order } = orders;
            const orderCount = order.reduce((count, items) => {
                return count + 1;
            }, 0)

            console.log(orderCount)

            const cList = document.querySelector('.cart-number')
            cList.innerHTML = orderCount;
        }



    }


}


let customerToken = localStorage.getItem('customer_token')
cartNumber(customerToken);
// let customerToken = localStorage.getItem('customer_token')
// cartNumber(customerToken);

        // Helper function to generate star icons based on rating
        function generateStars(rating) {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars.push('<i class="fas fa-star"></i>');
                } else {
                    stars.push('<i class="far fa-star"></i>');
                }
            }
            return stars.join('');
        }
    

//         const { result } = require("lodash")

// function solution(listA, listB) {
//     for (let i = 0; i < listA.length; i++){
//         result = listA[i] * listB[i]
//     }
//     return result
// }

// const listA = [1,2,3]
// const listB = [4,5,6]


// console.log(solution(listA, listB))

// function solution(arr, num) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//       if (Math.abs(arr[i] - arr[j]) === num) {
//         return true; 
//       }
//     }
//   }
//   return false; 
// }

// const arr = [4, 2, 8, 6];
// const num = 2;
// const difference = solution(arr, num);
// console.log(difference); 

// function solution(str) {
  
//   const cleanedStr = str.replace(/\D/g, '');

 
//   if (cleanedStr.length === 10) {
//     return true;
//   } else if (cleanedStr.length === 11 && cleanedStr[0] === '1') {
//     return true;
//   } else if (cleanedStr.length === 12 && cleanedStr.startsWith('1') && cleanedStr[1] === '-') {
//     return true; 
//   } else if (cleanedStr.length === 13 && cleanedStr.startsWith('1') && cleanedStr[1] === '(' && cleanedStr[5] === ')') {
//     return true; 
//   }
  
//   return false; 
// }


// console.log(solution("555-555-5555")); 
// console.log(solution("(555)555-5555")); 
// console.log(solution("(555) 555-5555")); 
// console.log(solution("555 555 5555")); 
// console.log(solution("5555555555")); 
// console.log(solution("1 555 555 5555")); 
// console.log(solution("800-692-7753")); 
// console.log(solution("8oo-six427676;laskdjf")); 



function solution(str) {

  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

 
  const len = cleanedStr.length;
  for (let i = 0; i < Math.floor(len / 2); i++) {
    if (cleanedStr[i] !== cleanedStr[len - 1 - i]) {
      return false; 
    }
  }
  
  return true; 
}


console.log(solution("racecar")); 
console.log(solution("RaceCar")); 
console.log(solution("race CAR")); 
console.log(solution("2A33a2")); 
console.log(solution("2A3 3a2")); 
console.log(solution("2_A33#A2")); 
console.log(solution("hello")); 


