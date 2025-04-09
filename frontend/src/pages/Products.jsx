import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  transferStock,
  getCategories,
  getWarehouses,
} from "../services/api";
import FormModal from "../components/FormModal.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    categoryId: "",
    warehouseId: "",
    lowStockThreshold: "",
    price: "",
    cost: "",
  });
  const [transferData, setTransferData] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(""); // Nouveau filtre par catégorie
  const [filterWarehouse, setFilterWarehouse] = useState(""); // Nouveau filtre par entrepôt
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, warehousesRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getWarehouses(),
      ]);
      let data = productsRes.data;
      data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setProducts(data);
      setCategories(categoriesRes.data);
      setWarehouses(warehousesRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const data = {
          ...formData,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          cost: Number(formData.cost),
          lowStockThreshold: Number(formData.lowStockThreshold),
        };
        if (selectedProduct) {
          await updateProduct(selectedProduct.id, data);
          toast.success("Produit mis à jour avec succès");
        } else {
          await createProduct(data);
          toast.success("Produit créé avec succès");
        }
        setFormData({
          name: "",
          quantity: "",
          categoryId: "",
          warehouseId: "",
          lowStockThreshold: "",
          price: "",
          cost: "",
        });
        setSelectedProduct(null);
        setIsFormOpen(false);
        fetchData();
      } catch (error) {
        toast.error("Erreur lors de l'opération");
      } finally {
        setLoading(false);
      }
    },
    [selectedProduct, formData, fetchData]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      toast.success("Produit supprimé avec succès");
      setSelectedProduct(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  }, [selectedProduct, fetchData]);

  const handleTransfer = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await transferStock({
          ...transferData,
          quantity: Number(transferData.quantity),
        });
        toast.success("Transfert effectué avec succès");
        setTransferData({
          productId: "",
          fromWarehouseId: "",
          toWarehouseId: "",
          quantity: "",
        });
        setIsTransferOpen(false);
        fetchData();
      } catch (error) {
        toast.error("Erreur lors du transfert");
      } finally {
        setLoading(false);
      }
    },
    [transferData, fetchData]
  );

  // Filtrage combiné par nom, catégorie et entrepôt
  const filteredProducts = products.filter((prod) => {
    const matchesName = prod.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? prod.categoryId === Number(filterCategory)
      : true;
    const matchesWarehouse = filterWarehouse
      ? prod.warehouseId === Number(filterWarehouse)
      : true;
    return matchesName && matchesCategory && matchesWarehouse;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Produits
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les entrepôts</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Trier par date ({sortOrder === "desc" ? "↓" : "↑"})
          </button>
          <button
            onClick={() => {
              setFormData({
                name: "",
                quantity: "",
                categoryId: "",
                warehouseId: "",
                lowStockThreshold: "",
                price: "",
                cost: "",
              });
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nouveau produit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Entrepôt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Prix
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`${
                      product.isLowStock ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {product.Category?.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {product.Warehouse?.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {product.price} Ar
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setFormData(product);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsConfirmOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 mr-3"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setTransferData({
                            productId: product.id,
                            fromWarehouseId: product.warehouseId,
                            toWarehouseId: "",
                            quantity: "",
                          });
                          setIsTransferOpen(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <ArrowRightCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedProduct ? "Modifier le produit" : "Nouveau produit"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entrepôt
            </label>
            <select
              value={formData.warehouseId}
              onChange={(e) =>
                setFormData({ ...formData, warehouseId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Sélectionner un entrepôt</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seuil de stock bas
            </label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({ ...formData, lowStockThreshold: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (Ar)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coût (Ar)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        message={`Voulez-vous vraiment supprimer le produit "${selectedProduct?.name}" ?`}
      />

      <FormModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Transférer le stock"
        onSubmit={handleTransfer}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entrepôt destination
            </label>
            <select
              value={transferData.toWarehouseId}
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  toWarehouseId: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Sélectionner un entrepôt</option>
              {warehouses
                .filter((w) => w.id !== transferData.fromWarehouseId)
                .map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              value={transferData.quantity}
              onChange={(e) =>
                setTransferData({ ...transferData, quantity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}

export default Products;
