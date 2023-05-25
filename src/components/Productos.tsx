import axios from "axios";
import { useState, useEffect } from "react";

function Productos() {
  interface Producto {
    id: number;
    title: string;
    price: number;
  }

  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<{ title: string; price: number }>({
    title: "",
    price: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoProducto({ ...nuevoProducto, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/productos", nuevoProducto);
      console.log(response.data);
      // Si la inserción fue exitosa, puedes actualizar la lista de productos
      setProductos([...productos, response.data]);
      setNuevoProducto({ title: "", price: 0 });
    } catch (error) {
      console.error("Error al enviar el nuevo producto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/productos/${id}`);
      setProductos(productos.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-violet-600">Listas de Productos</h1>
      <div>
        <form className="flex flex-col space-y-4 w-80" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={nuevoProducto.title}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="price"
            value={nuevoProducto.price}
            onChange={handleInputChange}
            placeholder="Precio"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 border-2 border-inherit rounded-lg text-white font-bold"
          >
            Agregar producto
          </button>
        </form>

        <div className="border border-gray-300 p-4 rounded-md w-80">
          {productos.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Nombre: {item.title}</h3>
                <h3>Precio: {item.price}</h3>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productos;
