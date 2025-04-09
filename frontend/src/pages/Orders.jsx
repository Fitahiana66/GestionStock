import { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  getSuppliers,
  getProducts,
  getOrderDetails,
} from "../services/api";
import FormModal from "../components/FormModal.jsx";
import { toast } from "react-toastify";
import { EyeIcon } from "@heroicons/react/24/outline";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    type: "purchase",
    supplierId: "",
    items: [{ productId: "", quantity: "", unitPrice: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, suppliersRes, productsRes] = await Promise.all([
        getOrders(),
        getSuppliers(),
        getProducts(),
      ]);
      let data = ordersRes.data;
      data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setOrders(data);
      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
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
          items: formData.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        };
        await createOrder(data);
        toast.success("Commande créée avec succès");
        setFormData({
          type: "purchase",
          supplierId: "",
          items: [{ productId: "", quantity: "", unitPrice: "" }],
        });
        setIsFormOpen(false);
        fetchData();
      } catch (error) {
        toast.error("Erreur lors de la création de la commande");
      } finally {
        setLoading(false);
      }
    },
    [formData, fetchData]
  );

  const handleStatusChange = useCallback(
    async (id, status) => {
      setLoading(true);
      try {
        await updateOrder(id, { status });
        toast.success("Statut mis à jour");
        fetchData();
      } catch (error) {
        toast.error("Erreur lors de la mise à jour");
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const handleViewDetails = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const response = await getOrderDetails(orderId);
      setSelectedOrderDetails(response.data);
      setIsDetailsOpen(true);
    } catch (error) {
      toast.error("Erreur lors du chargement des détails de la commande");
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: "", unitPrice: "" }],
    }));
  }, []);

  const updateItem = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const newItems = [...prev.items];
        if (field === "productId" && prev.type === "sale") {
          const selectedProduct = products.find(
            (prod) => prod.id === Number(value)
          );
          newItems[index] = {
            ...newItems[index],
            productId: value,
            unitPrice: selectedProduct ? selectedProduct.price.toString() : "",
          };
        } else {
          newItems[index] = { ...newItems[index], [field]: value };
        }
        return { ...prev, items: newItems };
      });
    },
    [products]
  );

  const filteredOrders = orders
    .filter((order) =>
      order.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) => (filterStatus ? order.status === filterStatus : true));

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Commandes
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher par type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Trier par date ({sortOrder === "desc" ? "↓" : "↑"})
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nouvelle commande
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
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {order.type === "purchase" ? "Achat" : "Vente"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        <option value="pending">En attente</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {order.totalAmount} Ar
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={loading}
                      >
                        <EyeIcon className="h-5 w-5" />
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
        title="Nouvelle commande"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="purchase">Achat</option>
              <option value="sale">Vente</option>
            </select>
          </div>
          {formData.type === "purchase" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) =>
                  setFormData({ ...formData, supplierId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.items.map((item, index) => (
            <div key={index} className="space-y-2 border p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produit
                </label>
                <select
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(index, "productId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
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
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix unitaire (Ar)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    formData.type === "purchase" &&
                    updateItem(index, "unitPrice", e.target.value)
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                    formData.type === "sale"
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                  required
                  disabled={loading || formData.type === "sale"}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            + Ajouter un article
          </button>
        </div>
      </FormModal>

      <FormModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Détails de la commande"
        showSubmitButton={false}
        hidden
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {selectedOrderDetails ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedOrderDetails.type === "purchase" ? "Achat" : "Vente"}
                </p>
              </div>
              {selectedOrderDetails.type === "purchase" &&
                selectedOrderDetails.supplierId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fournisseur
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrderDetails.Supplier?.name || "N/A"}
                    </p>
                  </div>
                )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Utilisateur
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedOrderDetails.User?.username || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedOrderDetails.status}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de création
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedOrderDetails.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Articles
                </label>
                <div className="mt-2 space-y-2">
                  {selectedOrderDetails.OrderItems.map((item, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <p className="text-sm text-gray-900">
                        <strong>Produit:</strong> {item.Product?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-900">
                        <strong>Quantité:</strong> {item.quantity}
                      </p>
                      <p className="text-sm text-gray-900">
                        <strong>Prix unitaire:</strong> {item.unitPrice} Ar
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant total
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedOrderDetails.totalAmount} Ar
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Aucun détail disponible</p>
          )}
        </div>
      </FormModal>
    </div>
  );
}

export default Orders;
