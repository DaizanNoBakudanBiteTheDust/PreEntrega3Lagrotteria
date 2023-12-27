const obj = {};



function purchaseCart(cartId) { // Recibe cartId como parámetro
    let urlParam = cartId;
    fetch(`/api/carts/${urlParam}/purchase`, {
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
           console.log("fallo")
        }
    })
    .catch(error => {
      console.log(error);
    });
  }