fetch("product.json")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("productContainer");

    function displayProducts(products){
      container.innerHTML = "";
      products.forEach(product => {
      product.variants.forEach(variant => { 
       const card = document.createElement("div");
          card.className = "card";

        card.innerHTML = `
            <img src="${variant.image}" alt="${product.title}" style="width:150px; height:60%;"/>
            <h3>${product.title} - ${variant.color}</h3>
            <p class="price">$${product.price}</p>
            <p class="desc">View more</p>
            <button class="delete-btn">Delete</button>
        `;

          card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("delete-btn")) {
              window.location.href = `product.html?id=${product.id}`;
            }
          });
          
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("itemCount").textContent = cart.length;

    card.querySelector(".delete-btn").addEventListener("click", e => {
            e.stopPropagation();
            card.remove();
        });

          container.appendChild(card);
        });
      });
    }

    displayProducts(products);

    document.getElementById("categoryFilter").addEventListener("change", e => {
      const value = e.target.value;
      if(value === "all"){
        displayProducts(products);
      } else {
        const filtered = products.filter(p => p.category === value);
        displayProducts(filtered);
      }
    });

    document.querySelectorAll("input[name='category']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const value = e.target.value;
        if (value === "all") {
          displayProducts(products);
        } else {
          const filtered = products.filter(p => p.category === value);
          displayProducts(filtered);
        }
      });
    });

  })
  .catch(err => console.error(err));
