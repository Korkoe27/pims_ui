import React, { useState } from 'react';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('medication');
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('');
  const [modalSubCategory, setModalSubCategory] = useState('');

  const inventoryData = {
    medication: {
      total: 120,
      tablets: 30,
      eyeDrops: 40,
      suspension: 20,
      syrup: 30,
    },
    optics: {
      total: 90,
      lens: 40,
      frames: 30,
      readers: 20,
    },
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const openModal = (mainCategory, subCategory) => {
    setModalCategory(mainCategory);
    setModalSubCategory(subCategory);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalCategory('');
    setModalSubCategory('');
  };

  return (
    <div className="px-8 ml-72 mt-8 flex flex-col gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      {/* Summary Section */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Inventory Summary</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Medication Summary */}
          <div>
            <h3 className="font-bold text-xl mb-4">Medication</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Total Card */}
              <div className="col-span-2 bg-blue-200 p-4 rounded shadow text-center">
                <h4 className="font-semibold text-lg">Total Medication</h4>
                <p className="text-3xl font-bold">{inventoryData.medication.total}</p>
              </div>
              {Object.entries(inventoryData.medication).map(([key, value]) =>
                key !== 'total' ? (
                  <div
                    key={key}
                    className="bg-blue-100 p-4 rounded shadow text-center"
                  >
                    <h4 className="font-semibold capitalize">{key}</h4>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
          {/* Optics Summary */}
          <div>
            <h3 className="font-bold text-xl mb-4">Optics</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Total Card */}
              <div className="col-span-2 bg-green-200 p-4 rounded shadow text-center">
                <h4 className="font-semibold text-lg">Total Optics</h4>
                <p className="text-3xl font-bold">{inventoryData.optics.total}</p>
              </div>
              {Object.entries(inventoryData.optics).map(([key, value]) =>
                key !== 'total' ? (
                  <div
                    key={key}
                    className="bg-green-100 p-4 rounded shadow text-center"
                  >
                    <h4 className="font-semibold capitalize">{key}</h4>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'medication' ? 'font-bold border-b-2 border-blue-500' : ''
          }`}
          onClick={() => handleTabChange('medication')}
        >
          Medication
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'optics' ? 'font-bold border-b-2 border-green-500' : ''
          }`}
          onClick={() => handleTabChange('optics')}
        >
          Optics
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'medication' && (
          <div>
            <h2 className="font-bold text-xl mb-2">Medication Inventory</h2>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => openModal('Medication', 'Tablets')}
            >
              Add Medication
            </button>
          </div>
        )}
        {activeTab === 'optics' && (
          <div>
            <h2 className="font-bold text-xl mb-2">Optics Inventory</h2>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => openModal('Optics', 'Lens')}
            >
              Add Optics
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add {modalCategory}</h2>
            <form>
              <div className="mb-4">
                <label className="block font-bold mb-2">Main Category</label>
                <input
                  type="text"
                  value={modalCategory}
                  readOnly
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Sub Category</label>
                <input
                  type="text"
                  value={modalSubCategory}
                  readOnly
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
