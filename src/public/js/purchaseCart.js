const obj = {};



function purchaseCart() { // Recibe cartId como parámetro
    const cartId = document.getElementById("cartId").value;

    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if (result.status === 200 || result.status === 201) {
            console.log("bien")
        }else{
           console.log(result.status, "fallo")
        }
    })
    .catch(error => {
      console.log(error);
    });
  }