"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Modal } from "@/components/Modal/ModalSupplier";
import supabase from "@/supabase";
import TableSupplier from "@/components/Tables/TableSupplier";

interface FormState {
  name: string;
  location: string;
  phone_number: string;
}

const SupplierPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  // const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const { data, error } = await supabase.from("Supplier").select("*");

        if (error) {
          throw error;
        }

        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching Supplier data:", error.message);
      }
    };

    fetchSupplierData();
  }, []);

  const handleDeleteRow = async (key) => {
    // setRows(rows.filter((_, idx) => idx !== targetIndex));
    try {
      // Mendapatkan ID item yang ingin dihapus dari state atau data yang tersimpan
      const itemIdToDelete = supplierData[key].name; // Gantilah dengan properti ID yang sesuai

      // Menghapus item dari basis data menggunakan Supabase
      const { data, error } = await supabase
        .from("Supplier")
        .delete()
        .eq("name", itemIdToDelete);

      // Periksa apakah operasi delete berhasil
      if (error) {
        throw error;
      } else {
        setSupplierData((prevData) =>
          prevData.filter((item) => item.name !== itemIdToDelete)
        );
      }

      // Jika berhasil, perbarui state atau data yang digunakan untuk menampilkan tabel
      // setInventoryData([...inventoryData, data]);
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const handleEditRow = (key) => {
    setRowToEdit(key);

    setModalOpen(true);
  };

  const handleSubmit = async (formState: FormState) => {
    
    try {
      if (rowToEdit !== null) {
        const { data, error } = await supabase
          .from("Supplier")
          .update([
            {
              name: formState.name,
              location: formState.location,
              phone_number: formState.phone_number,
            },
          ])
          .eq("name", formState.name);
        // .single(); // Hanya mengembalikan satu baris hasil update

        if (error) {
          throw error;
        }
        const updatedData = supplierData.map((item) =>
          item.name === formState.name ? { ...item, ...formState } : item
        );
        setSupplierData(updatedData);

        console.log("Record updated successfully:", data);
      } else {
        console.log("Row to Edit after set: ", rowToEdit);
        const { data, error } = await supabase.from("Supplier").insert([
          {
            name: formState.name,
            location: formState.location,
            phone_number: formState.phone_number,
          },
          // { onConflict: ["name"] }
        ]);
        if (error) {
          throw error;
        }

        // Tambahkan newItem ke state lokal untuk pembaruan tampilan
        setSupplierData([...supplierData, formState]);
      }
    } catch (error) {
      console.error("Error adding item to supplier:", error.message);
    }
    setRowToEdit(null);
    // const { data, error } = await supabase.from("Inventory").select("*");
  };

  return (
    <>
      <Breadcrumb pageName="Supplier" />

      <div className="flex flex-col gap-10">
        <TableSupplier
          rows={supplierData}
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
            defaultValue={rowToEdit !== null && supplierData[rowToEdit]}
          />
        )}
      </div>
    </>
  );
};

export default SupplierPage;
