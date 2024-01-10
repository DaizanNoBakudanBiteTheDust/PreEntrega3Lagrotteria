    import { cartsModel } from "./models/carts.models.js";

    export default class Carts {
        constructor(){
            console.log("db trabajando en carts")
        }

        getAll = async () => {

            const carts = await cartsModel.find().lean();
            console.log(JSON.stringify(carts, null, '\t'));
            return carts;
        }

        save = async (cart) => {
            try {
                const result = await cartsModel.create(cart);
                return { status: 200, message: 'Cart created successfully', cart: result };
            } catch (error) {
                return { status: error.status || 500, error: error.message };
            }
        }

        update = async (id, cart) => {
            const result = await cartsModel.updateOne({_id : id}, cart);
            return result;
        }

        delete = async (id, cart) => {
            const result = await cartsModel.deleteOne({_id : id}, cart);
            return result;
        }

        getCartById = async (id) => {
            try {
                const cart = await cartsModel.findById(id);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
        
            return cart;
                
            } catch (error) {
                return { status: error.status || 500, error: error.message };
            }
            
        }

        getProductById = async (id) => {

            const product = await cartsModel.findById(id);

            if (!product) {
                console.log('producto no encontrado');
            }
        
            return product;

        };
        
        

        deleteProductById = async (id, cart) => {
            const product = await cartsModel.deleteOne({ _id: id}).lean();
            
            if (!product) {
                throw new Error('Producto no encontrado');

            } 
            return product;
        }

        async emptyCart(id) {
            try {
              const cart = await cartsModel.findById(id);
          
              if (!cart) {
                throw new Error('Carrito no encontrado');
              }
          
              console.log("Estado del carrito antes de la actualización:", cart);
          
              cart.products = []; // Asumiendo que hay una propiedad 'products' que contiene los productos del carrito
          
              // Actualizar el carrito usando la función update del model
              const updatedCart = await cart.save();
          
              console.log("Estado del carrito después de la actualización:", updatedCart);
          
              return { status: 200, message: 'Carrito vaciado exitosamente', cart: updatedCart };
          
            } catch (error) {
              return { status: error.status || 500, error: error.message };
            }
          }
    }
