"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Modal } from "@/components/Modal/ModalOrder";
import supabase from "@/supabase";
import TableOrder from "@/components/Tables/TableOrder";

import { Metadata } from "next";

interface FormState {
  stockName: string;
  supplier: string;
  orderDate: Date;
  arrivalDate: Date;
  orderStatus: string;
  quantity: number;
  totalPrice: number;
}

const TablesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const [orderData, setOrderData] = useState<any[]>([]);
  // const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const { data, error } = await supabase.from("Order").select("*");

        if (error) {
          throw error;
        }

        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order data:", error.message);
      }
    };

    fetchOrderData();
  }, []);

  const [rowToEdit, setRowToEdit] = useState(null);

  const handleDeleteRow = async (key) => {
    // setRows(rows.filter((_, idx) => idx !== targetIndex));
    try {
      // Mendapatkan ID item yang ingin dihapus dari state atau data yang tersimpan
      const itemIdToDelete = orderData[key].name; // Gantilah dengan properti ID yang sesuai

      // Menghapus item dari basis data menggunakan Supabase
      const { data, error } = await supabase
        .from("Order")
        .delete()
        .eq("name", itemIdToDelete);

      // Periksa apakah operasi delete berhasil
      if (error) {
        throw error;
      } else {
        setOrderData((prevData) =>
          prevData.filter((item) => item.name !== itemIdToDelete)
        );
      }

      // Jika berhasil, perbarui state atau data yang digunakan untuk menampilkan tabel
      // setOrderData([...OrderData, data]);
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
        stockName: formState.stockName,
          supplier: formState.supplier,
          orderDate: formState.orderDate,
          arrivalDate: formState.arrivalDate,
          orderStatus: formState.orderStatus,
          quantity: formState.quantity,
          totalPrice: formState.totalPrice
      },
    ]);
    try {
      const { data, error } = await supabase.from("Order").insert([
        {
          stockName: formState.stockName,
          supplier: formState.supplier,
          orderDate: formState.orderDate,
          arrivalDate: formState.arrivalDate,
          orderStatus: formState.orderStatus,
          quantity: formState.quantity,
          totalPrice: formState.totalPrice
        },
        // { onConflict: ["name"] }
      ]);
      if (error) {
        throw error;
      }

      // Tambahkan newItem ke state lokal untuk pembaruan tampilan
      setOrderData([...orderData, formState]);
    } catch (error) {
      console.error("Error adding item to order:", error.message);
    }
    // const { data, error } = await supabase.from("Order").select("*");
  };

  return (
    <>
      <Breadcrumb pageName="Order" />

      <div className="flex flex-col gap-10">
        <TableOrder
          rows={orderData}
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
            defaultValue={rowToEdit !== null && orderData[rowToEdit]}
          />
        )}
      </div>
    </>
  );
};

export default TablesPage;
