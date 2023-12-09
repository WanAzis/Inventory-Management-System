"use client";
import { Package } from "@/types/package";
import React, { useState } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

interface TableThreeProps {
  rows: any[]; // replace any with the actual type
  deleteRow: (rowId: string) => void; // replace parameters and return type with actual ones
  editRow: any; // replace any with the actual type
  openModal: any;
}

const TableSupplier: React.FC<TableThreeProps> = ({
  rows,
  deleteRow,
  editRow,
  openModal,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Supplier List
          </h4>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-4 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-7 h-10"
          >
            Add Item
          </button>
        </div>
        {/* <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <h1>Add Item</h1>
        </Modal> */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Location
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Phone Number
              </th>
              <th className="min-w-[35px] py-4 px-4 font-medium text-black dark:text-white">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, key) => (
              <tr key={key} className="hover:bg-gray dark:hover:bg-meta-4">
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {row.name}
                  </h5>
                  {/* <p className="text-sm">{row.location}</p> */}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{row.location}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.phone_number}
                  </p>
                </td>

                <td>
                  <span className="flex hover:cursor-pointer justify-around">
                    <BsFillTrashFill
                      className="text-danger"
                      onClick={() => deleteRow(key)}
                    />
                    <BsFillPencilFill onClick={() => editRow(key)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSupplier;
