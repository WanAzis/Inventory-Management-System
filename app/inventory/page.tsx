"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Modal } from "@/components/Modal/ModalInventory";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableInventory";
import TableTwo from "@/components/Tables/TableTwo";
import supabase from "@/supabase";

import { Metadata } from "next";

interface FormState {
  name: string;
  location: string;
  quantity: number;
  minQuantity: number;
  status: string;
  expDate: Date;
}

const TablesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
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

  const [rows, setRows] = useState([
    {
      name: "Benih Jagung",
      location: "Gudang 1",
      quantity: 100,
      minQuantity: 10,
      status: "Available",
      expDate: "2024-02-10",
    },
    {
      name: "Benih Padi",
      location: "Gudang 1",
      quantity: 100,
      minQuantity: 10,
      status: "Low",
      expDate: "2024-02-10",
    },
    {
      name: "Pupuk",
      location: "Gudang 1",
      quantity: 100,
      minQuantity: 30,
      status: "Unavailable",
      expDate: "2024-02-10",
    },
  ]);
  const [rowToEdit, setRowToEdit] = useState(null);

  const handleDeleteRow = async (key) => {
    // setRows(rows.filter((_, idx) => idx !== targetIndex));
    try {
      // Mendapatkan ID item yang ingin dihapus dari state atau data yang tersimpan
      const itemIdToDelete = inventoryData[key].name; // Gantilah dengan properti ID yang sesuai

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

  const handleEditRow = (idx) => {
    setRowToEdit(idx);

    setModalOpen(true);
  };

  // const handleSubmit = (newRow) => {
  //   rowToEdit === null
  //     ? setRows([...rows, newRow])
  //     : setRows(
  //         rows.map((currRow, idx) => {
  //           if (idx !== rowToEdit) return currRow;

  //           return newRow;
  //         })
  //       );
  // };
  const handleSubmit = async (formState: FormState) => {
    console.log("Form State:", formState);
    console.log("Data to be inserted:", [
      {
        name: formState.name,
        location: formState.location,
        quantity: formState.quantity,
        minQuantity: formState.minQuantity,
        status: formState.status,
        expDate: formState.expDate,
      },
    ]);
    try {
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
    } catch (error) {
      console.error("Error adding item to inventory:", error.message);
    }
    // const { data, error } = await supabase.from("Inventory").select("*");
  };

  return (
    <>
      <Breadcrumb pageName="Inventory" />

      <div className="flex flex-col gap-10">
        <TableThree
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

export default TablesPage;
