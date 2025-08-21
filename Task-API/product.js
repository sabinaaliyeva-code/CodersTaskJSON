function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const productId = getProductIdFromURL();

fetch("product.json")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id == productId);
    const container = document.getElementById("productDetails");
    if(!product){
      container.innerHTML = "<p>Product not found</p>";
      return;
    }

    const detailCard = document.createElement("div");
    detailCard.className = "card";

    const initialImage = product.variants[0].image;

    let colorButtonsHTML = product.variants.map(v => 
      `<button class="color-btn" data-image="${v.image}" data-color="${v.color}">${v.color}</button>`
    ).join("");

    detailCard.innerHTML = `
      <div>
      <img id="productImage" src="${initialImage}" alt="${product.title}" style="width:100%"/>
      <p class="price">$${product.price}</p>
      <h3>${product.title}</h3>
      </div>
      <div class="colors">${colorButtonsHTML}</div>
      <button id="addCartBtn">Add to Cart</button>
      <div id="cart"></div>
    `;
    container.appendChild(detailCard);

    const imgElement = detailCard.querySelector("#productImage");
    const colorButtons = document.querySelectorAll(".color-btn");

    
    colorButtons[0].classList.add("active");

    colorButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        colorButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        imgElement.src = btn.dataset.image;
      });
    });

    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartUI() {
      const cartEl = document.getElementById("cart");
      cartEl.innerHTML = "";

      cart.forEach((item, index) => {
        cartEl.innerHTML += `
          <div class="cart-item">
            ${item.title} - ${item.color} - $${item.price}
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        `;
      });

      
      localStorage.setItem("cart", JSON.stringify(cart));

      
      const itemCountEl = document.getElementById("itemCount");
      if(itemCountEl) {
        itemCountEl.textContent = cart.length;
      }

      
      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = btn.dataset.index;
          cart.splice(i,1);
          updateCartUI();
        });
      });
    }

    
    document.getElementById("addCartBtn").addEventListener("click", () => {
      const activeBtn = document.querySelector(".color-btn.active");
      const selectedColor = activeBtn.dataset.color;

      const existing = cart.find(i => i.id == product.id && i.color == selectedColor);
      if(!existing){
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          color: selectedColor,
          image: activeBtn.dataset.image
        });
      }

      updateCartUI();
    });

    updateCartUI(); 

    
    const buyNowBtn = document.createElement("button");
    buyNowBtn.textContent = "Buy Now";
    buyNowBtn.addEventListener("click", () => {
      if(cart.length === 0){
        alert("Your cart is empty!");
        return;
      }
      
      window.location.href = "payment.html";
    });
    container.appendChild(buyNowBtn);

  })
  .catch(err => console.error(err));
