"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Modal } from "@/components/Modal/ModalInventory";
import supabase from "@/supabase";
import TableInventory from "@/components/Tables/TableInventory";


interface FormState {
  name: string;
  location: string;
  quantity: number;
  minQuantity: number;
  status: string;
  expDate: Date;
}

const InventoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [rowToEdit, setRowToEdit] = useState<any[]>([]);
  // const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const { data, error } = await supabase.from("Inventory").select("*");

        if (error) {
          throw error;
        }

        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error.message);
      }
    };

    fetchInventoryData();
  }, []);

  const handleDeleteRow = async (key) => {
    try {
      // Mendapatkan ID item yang ingin dihapus dari state atau data yang tersimpan
      const itemIdToDelete = inventoryData[key].name;

      // Menghapus item dari basis data menggunakan Supabase
      const { data, error } = await supabase
        .from("Inventory")
        .delete()
        .eq("name", itemIdToDelete);

      // Periksa apakah operasi delete berhasil
      if (error) {
        throw error;
      } else {
        setInventoryData((prevData) =>
          prevData.filter((item) => item.name !== itemIdToDelete)
        );
      }

      // Jika berhasil, perbarui state atau data yang digunakan untuk menampilkan tabel
      // setInventoryData([...inventoryData, data]);
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const handleEditRow = async (key) => {

    setRowToEdit(key);
    setModalOpen(true);
  };

  const handleSubmit = async (formState: FormState) => {
    try {
      if (rowToEdit !== null) {
        const { data, error } = await supabase
          .from("Inventory")
          .update([
            {
              location: formState.location,
              quantity: formState.quantity,
              minQuantity: formState.minQuantity,
              status: formState.status,
              expDate: formState.expDate,
            },
          ])
          .eq("name", formState.name);
        // .single(); // Hanya mengembalikan satu baris hasil update

        if (error) {
          throw error;
        }
        const updatedData = inventoryData.map((item) =>
          item.name === formState.name ? { ...item, ...formState } : item
        );
        setInventoryData(updatedData);

        console.log("Record updated successfully:", data);
      } else {
        console.log("Row to Edit after set: ", rowToEdit);
        const { data, error } = await supabase.from("Inventory").insert([
          {
            name: formState.name,
            location: formState.location,
            quantity: formState.quantity,
            minQuantity: formState.minQuantity,
            status: formState.status,
            expDate: formState.expDate,
          },
          // { onConflict: ["name"] }
        ]);
        if (error) {
          throw error;
        }

        // Tambahkan newItem ke state lokal untuk pembaruan tampilan
        setInventoryData([...inventoryData, formState]);
      }
    } catch (error) {
      console.error("Error adding item to inventory:", error.message);
    }
    setRowToEdit(null);

    // const { data, error } = await supabase.from("Inventory").select("*");
  };

  return (
    <>
      <Breadcrumb pageName="Inventory" />

      <div className="flex flex-col gap-10">
        <TableInventory
          rows={inventoryData}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
          openModal={openModal}
        />
        {modalOpen && (
          <Modal
            closeModal={() => {
              setModalOpen(false);
              setRowToEdit(null);
            }}
            onSubmit={handleSubmit}
            defaultValue={rowToEdit !== null && inventoryData[rowToEdit]}
          />
        )}
      </div>
    </>
  );
};

export default InventoryPage;
