import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { arrayMove } from "@dnd-kit/sortable";
import API from "../../api/api";

import "./ProductManagement.css";

import ProductTable from "../../components/ProductTable/ProductTable";
import ProductModal from "../../components/ProductTable/ProductModal";

const ProductManagement = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===========================
  // FETCH PRODUCTS
  // ===========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await API.get("/products");

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);

      alert("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // SEARCH
  // ===========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.productName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  // ===========================
  // CREATE
  // ===========================

  const openCreateModal = () => {
    setSelectedProduct(null);

    setModalVisible(true);
  };

  // ===========================
  // EDIT
  // ===========================

  const openEditModal = (product) => {
    setSelectedProduct(product);

    setModalVisible(true);
  };

  // ===========================
  // DELETE
  // ===========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);

      fetchProducts();
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  // ===========================
  // STATUS
  // ===========================

  const toggleStatus = async (product) => {
    try {
      await API.put(`/products/${product._id}`, {
        ...product,
        isActive: !product.isActive,
      });

      fetchProducts();
    } catch (error) {
      alert("Failed to update product.");
    }
  };

  // ===========================
  // DRAG & DROP
  // ===========================

 const handleDragEnd = async (event) => {
   const { active, over } = event;

   if (!over || active.id === over.id) return;

   const oldIndex = products.findIndex((item) => item._id === active.id);

   const newIndex = products.findIndex((item) => item._id === over.id);

   const reorderedProducts = arrayMove(products, oldIndex, newIndex);

   const updatedProducts = reorderedProducts.map((product, index) => ({
     ...product,
     order: reorderedProducts.length - index - 1,
   }));

   // Optimistic UI
   setProducts(updatedProducts);

   try {
     await API.patch(
       "/products/reorder",
       updatedProducts.map((product) => ({
         _id: product._id,
         order: product.order,
       })),
     );
   } catch (error) {
     alert("Failed to save order.");

     fetchProducts();
   }
 };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>Product Management</h1>
        </div>

        <button className="add-btn" onClick={openCreateModal}>
          + Add Product
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
        onDragEnd={handleDragEnd}
      />

      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedProduct={selectedProduct}
        refreshProducts={fetchProducts}
      />
    </div>
  );
};;

export default ProductManagement;
