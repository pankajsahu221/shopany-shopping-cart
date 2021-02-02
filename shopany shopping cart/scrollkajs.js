const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear(); 

const toggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links");
const spotContainer = document.querySelector(".spot-container");

// fixed navbar and back to top button 
const navbar = document.getElementById("navbar");
const btt = document.querySelector(".btt");


//get height of links container 
getlinksContainerHeight();

function getlinksContainerHeight(){   
    /* we can not use this show-navbar function if we have more than 4 links or we want to add more 
       then it will not show bcoz the height in the show-navbar function is fixed */ 
    // linksContainer.classList.toggle("show-navbar");
    
    // const linksContainerHeight = linksContainer.getBoundingClientRect().height;
    // console.log(linksContainerHeight);
    
    const linksHeight = links.getBoundingClientRect().height;
    linksContainer.style.height=`${linksHeight}px`;
};

window.addEventListener("scroll",function(){
    const scrollHeight = window.pageYOffset;
    const navHeight = navbar.getBoundingClientRect().height;

    //fixing the postion for the links container
         if(linksContainer.classList.contains("show-links-container")){
             linksContainer.classList.add("fixed-links-container");
         }    
    // }
    // will show the height in each scroll
   // console.log(scrollHeight);

   //fixing the postion for back to top button
    if(scrollHeight > 500){
        btt.classList.add("show-btt");
    }
    else{
        btt.classList.remove("show-btt");
    }
});

toggle.addEventListener("click",function(){
    linksContainer.classList.toggle("show-links-container");
});


//fixing the position of landing of navbar bar in scrolling down to current clicked location
const scrollLink = document.querySelectorAll(".scroll-link");

scrollLink.forEach(function(link){
    link.addEventListener("click", perfScroll);
});

const btnWhite = document.querySelector(".btn-white");
btnWhite.addEventListener("click", perfScroll);

function perfScroll(e){
         
        //prevent the action to be performed
        e.preventDefault();

        // used slice(0) to remove the "#" from the attribute
        const id = e.currentTarget.getAttribute("href").slice(1);
        //console.log(id)  prints '#tours','#serivces' etc and after doing slice(1) we get 'services','tours' etc
        const element = document.getElementById(id);
        
        const containerHeight = linksContainer.getBoundingClientRect().height;
        //console.log(position); it will show to postion height of perticular link
        // const navHeader = document.querySelector(".nav-header");
        const navHeight = navbar.getBoundingClientRect().height;
        let correctPosition = element.offsetTop - navHeight;
        
        // console.log(navHeight);  

        window.scrollTo({
            left:0,
            top:correctPosition,
        });
        linksContainer.classList.remove("show-links-container");
}


// open and close cartlist
const cartBtn = document.querySelector(".cart-btn");
const slidebar = document.querySelector(".slidebar");
const closeBtn = document.querySelector(".close_btn");
cartBtn.addEventListener("click",function(){
      slidebar.classList.toggle("show_slidebar");
})
closeBtn.addEventListener("click",function(){
    slidebar.classList.toggle("show_slidebar"); 
})

// clear cart
const clearCart = document.querySelector(".clear-cart");
clearCart.addEventListener("click",function(){
    const items = document.querySelectorAll(".cart-item");

    if(items.length > 0){
        items.forEach(function(item){
            cartContent.removeChild(item);
        })
    }
    cartTotal.textContent = 0;

    // changing all addToCartbtns textContent and disabled=true;
    addToCartBtns.forEach(function(btn){          
        btn.textContent = "add to cart";
        btn.disabled = false;
    })

    localStorage.removeItem("cartList");
})

// add item to cart 
const cartContent = document.querySelector(".cart-content");
const addToCartBtns = document.querySelectorAll(".add-to-cart");
let cartTotal = document.querySelector(".cart-total");

addToCartBtns.forEach(function(btn){
    const btnId = btn.dataset.id;

    let items = getLocalstorage();
    let isAdded = items.find(function(item){
       return item.id === btnId;
    })
    if(isAdded){
        btn.innerText = "added";
        btn.disabled = true;
    }
   
    btn.addEventListener("click",function(e){
            e.target.textContent = "added";
            e.target.disabled = true;
            // will print the id of the perticular element
            // console.log(e.target.parentElement.parentElement.dataset.id);
            const id =  e.target.parentElement.parentElement.dataset.id;
            
            // FullPathImg is in the form of string
            let FullPathImg = e.target.parentElement.previousElementSibling.previousElementSibling.src ;
            let posImg = FullPathImg.indexOf('images') + 6;
            let partpath = FullPathImg.slice(posImg);
            
            const item = {};
            item.img = `images-cart${partpath}`;
            
            let name = e.target.parentElement.previousElementSibling.children[0].children[0].textContent ;
            item.name = name;

            // used slice(3) to remove the 'Rs.' from the price
            let price = e.target.parentElement.previousElementSibling.children[0].children[1].textContent.slice(3) ;
            item.price = price;

            item.quantity = 1;
            // item.disable = true;

            // console.log(item);
            createCartList(id,item.img,item.name,item.price,item.quantity);
            // add item to local storage
            addToLocalStorage(id,item.img,item.name,item.price,item.quantity);
    })
})

function changebtnText(id){
    addToCartBtns.forEach(function(btn){  
        if(btn.dataset.id == id){
            btn.textContent = "add to cart";
            btn.disabled = false;
        }
    })
}

// to remove item from cart
function deleteItem(e){
    // console.log(e.target.previousElementSibling.textContent.slice(3));
    const item = e.target.parentElement.parentElement;
    const id = item.dataset.id;
    
    cartContent.removeChild(item);
    
    // to change the text of addToCart btn from 'Added' to 'add to cart' and making disabled=false.
    changebtnText(id);

    // delete from local storage
    deleteFromLocalStorage(id);
}

// to remove item when the quantity is 0
function deleteWhenQuantityZero(e){
     let item = e.currentTarget.parentElement.parentElement ;
     
     cartContent.removeChild(item);
}

// to increase the quantity
function addQuantity(e){
    // price of item
    let price = e.currentTarget.parentElement.previousElementSibling.children[1].textContent ;
    price = price.slice(3);
    
    // adding the price to the cartTotal
    cartTotal.textContent = parseInt(cartTotal.textContent) + parseInt(price) ;

    const id = e.currentTarget.parentElement.parentElement.dataset.id ;

    let quantity = e.currentTarget.nextElementSibling;
    quantity.textContent = parseInt(quantity.textContent) + 1;

    addQuantityInLocalStorage(id);
}

// to decease the quantity
function removeQuantity(e){
    let price = e.currentTarget.parentElement.previousElementSibling.children[1].textContent ;
    price = price.slice(3);

    
    const id = e.currentTarget.parentElement.parentElement.dataset.id ;

    let quantity = e.currentTarget.previousElementSibling;
    quantity.textContent = parseInt(quantity.textContent) - 1;

    if(quantity.textContent == 0){
        // when quantity of item is 0,delete that item from cart and local storage
        deleteWhenQuantityZero(e);
        changebtnText(id);
        deleteFromLocalStorage(id);
    }
    else{
        removeQuantityInLocalStorage(id);
        cartTotal.textContent = parseInt(cartTotal.textContent) - parseInt(price) ;
    }
}

// *******************
// ***local storage***
// *******************
function getLocalstorage(){
    return localStorage.getItem("cartList")?JSON.parse(localStorage.getItem("cartList")):[];
}

function addToLocalStorage(id,img,name,price,quantity){
    const grocery = {id,img,name,price,quantity};
    let items = getLocalstorage();

    items.push(grocery);

    localStorage.setItem("cartList",JSON.stringify(items));
}

function deleteFromLocalStorage(id){
    let items = getLocalstorage();
    let itemQuantity,itemPrice;

    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
        else if(item.id == id){
            itemPrice = item.price;
            itemQuantity = item.quantity;
        }
    })

    cartTotal.textContent = parseInt(cartTotal.textContent) - parseInt(itemPrice) * parseInt(itemQuantity) ;

    localStorage.setItem("cartList",JSON.stringify(items));
}

function addQuantityInLocalStorage(id){
    let items = getLocalstorage();

    items.map(function(item){
        if(item.id == id){
            item.quantity = parseInt(item.quantity) + 1;
        }
        return item;
    });
    localStorage.setItem("cartList",JSON.stringify(items));
}

function removeQuantityInLocalStorage(id){
    let items = getLocalstorage();

    items.map(function(item){
        if(item.id == id){
            item.quantity = parseInt(item.quantity) - 1;
        }
        return item;
    });
    localStorage.setItem("cartList",JSON.stringify(items));
}

// ************************
// *****SETUP CARTLIST*****
// ************************
window.addEventListener("DOMContentLoaded",function(){
    let items = getLocalstorage();

    if(items.length > 0){
        items.forEach(function(item){
            createCartList(item.id,item.img,item.name,item.price,item.quantity);
        })
    }
});

function createCartList(id,img,name,price,quantity){

    const element = document.createElement("div");
    element.classList.add("cart-item");

    const attr = document.createAttribute("data-id");
    attr.value = id;

    element.setAttributeNode(attr);

    element.innerHTML = 
        `<img src="${img}" alt="thai">

        <div class="cart-item-detail">
           <h4>${name}</h4>
           <h5>Rs.${price}</h5>
           <span class="remove-item">remove</span>
        </div>
        <div class="cart-item-quantity">
          <div class="chevron-up"> <i class="fas fa-chevron-up"></i> </div>
          <p class="item-quantity">${quantity}</p>
          <div class="chevron-down"> <i class="fas fa-chevron-down"></i> </div>
        </div>`;

        cartContent.appendChild(element);

        cartTotal.textContent = parseInt(cartTotal.textContent) + (parseInt(price) * parseInt(quantity));
        // to delete the item
        const removeBtn = element.querySelector(".remove-item");
        const chevronUp = element.querySelector(".chevron-up");
        const chevronDown = element.querySelector(".chevron-down");

        removeBtn.addEventListener("click",deleteItem);
        chevronUp.addEventListener("click",addQuantity);
        chevronDown.addEventListener("click",removeQuantity);

}