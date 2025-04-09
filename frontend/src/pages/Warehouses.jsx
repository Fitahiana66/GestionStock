import { useState, useEffect, useCallback } from "react";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../services/api";
import FormModal from "../components/FormModal.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWarehouses();
      let data = res.data;
      data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setWarehouses(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des entrepôts");
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (selectedWarehouse) {
          await updateWarehouse(selectedWarehouse.id, formData);
          toast.success("Entrepôt mis à jour avec succès");
        } else {
          await createWarehouse(formData);
          toast.success("Entrepôt créé avec succès");
        }
        setFormData({ name: "", location: "" });
        setSelectedWarehouse(null);
        setIsFormOpen(false);
        fetchWarehouses();
      } catch (error) {
        toast.error("Erreur lors de l'opération");
      } finally {
        setLoading(false);
      }
    },
    [selectedWarehouse, formData, fetchWarehouses]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteWarehouse(selectedWarehouse.id);
      toast.success("Entrepôt supprimé avec succès");
      setSelectedWarehouse(null);
      fetchWarehouses();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  }, [selectedWarehouse, fetchWarehouses]);

  const filteredWarehouses = warehouses.filter((wh) =>
    wh.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Entrepôts
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher un entrepôt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Trier par date ({sortOrder === "desc" ? "↓" : "↑"})
          </button>
          <button
            onClick={() => {
              setFormData({ name: "", location: "" });
              setSelectedWarehouse(null);
              setIsFormOpen(true);
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nouvel entrepôt
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
                    Emplacement
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {warehouse.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {warehouse.location}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedWarehouse(warehouse);
                          setFormData(warehouse);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWarehouse(warehouse);
                          setIsConfirmOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
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
        title={selectedWarehouse ? "Modifier l'entrepôt" : "Nouvel entrepôt"}
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
              Emplacement
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
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
        message={`Voulez-vous vraiment supprimer l'entrepôt "${selectedWarehouse?.name}" ?`}
      />
    </div>
  );
}

export default Warehouses;
