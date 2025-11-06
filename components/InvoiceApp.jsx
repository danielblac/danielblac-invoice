"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Printer, Edit } from "lucide-react";
import Image from "next/image";

const ModernInvoiceApp = () => {
  const initialInvoiceData = {
    invoiceNo: "DBINV00232",
    invoiceDate: "Dec 2, 2024",
    billTo: {
      name: "Nirhra Tech",
      address: "",
      phone: "",
      email: "",
    },
    items: [
      {
        id: 1,
        description: "nirhra-tech app",
        rate: 800000,
        qty: 1,
      },
    ],
    paidTotal: 0,
    tax: 0,
    accountInfo: [
      {
        id: 1,
        accountNumber: "1022337231",
        accountName: "Daniel Ebipamowei Egboro",
        bankName: "UNITED BANK FOR AFRICA",
      },
      {
        id: 2,
        accountNumber: "9055316606",
        accountName: "Daniel Ebipamowei Egboro",
        bankName: "Opay",
      },
    ],
    termsAndConditions: [
      "Payment Validates Order",
      "Minimum of 80% initial payment of the total charge required",
      "Project will be delivered within agreed timeline from the date of initial payment",
      "Payment balance to be paid on or before delivery",
      "Kindly send proof of payment for confirmation",
    ],
    customNote:
      "Please do not hesitate to contact us for any further clarification.",
  };

  const contentRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("danielblac_invoice_data");
    if (savedData) {
      setInvoiceData(JSON.parse(savedData));
    }
  }, []);

  const calculateLineTotal = (rate, qty) => {
    return rate * qty;
  };

  const calculateSubtotal = (items) => {
    return items.reduce(
      (sum, item) => sum + calculateLineTotal(item.rate, item.qty),
      0
    );
  };

  const calculateTotal = (items, tax) => {
    return calculateSubtotal(items) + tax;
  };

  const calculateBalance = (items, tax, paidTotal) => {
    return calculateTotal(items, tax) - paidTotal;
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString("en-NG")}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = () => {
    setEditData(JSON.parse(JSON.stringify(invoiceData)));
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setInvoiceData(editData);
    localStorage.setItem("danielblac_invoice_data", JSON.stringify(editData));
    setIsEditModalOpen(false);
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      rate: 0,
      qty: 1,
    };
    setEditData({
      ...editData,
      items: [...editData.items, newItem],
    });
  };

  const handleRemoveItem = (id) => {
    if (editData.items.length > 1) {
      setEditData({
        ...editData,
        items: editData.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleItemChange = (id, field, value) => {
    setEditData({
      ...editData,
      items: editData.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "rate" || field === "qty"
                  ? Number(value) || 0
                  : value,
            }
          : item
      ),
    });
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: Date.now(),
      accountNumber: "",
      accountName: "",
      bankName: "",
    };
    setEditData({
      ...editData,
      accountInfo: [...editData.accountInfo, newAccount],
    });
  };

  const handleRemoveAccount = (id) => {
    if (editData.accountInfo.length > 1) {
      setEditData({
        ...editData,
        accountInfo: editData.accountInfo.filter((acc) => acc.id !== id),
      });
    }
  };

  const handleAccountChange = (id, field, value) => {
    setEditData({
      ...editData,
      accountInfo: editData.accountInfo.map((acc) =>
        acc.id === id ? { ...acc, [field]: value } : acc
      ),
    });
  };

  const handleAddTerm = () => {
    setEditData({
      ...editData,
      termsAndConditions: [...editData.termsAndConditions, ""],
    });
  };

  const handleRemoveTerm = (index) => {
    setEditData({
      ...editData,
      termsAndConditions: editData.termsAndConditions.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...editData.termsAndConditions];
    newTerms[index] = value;
    setEditData({
      ...editData,
      termsAndConditions: newTerms,
    });
  };

  const subtotal = calculateSubtotal(invoiceData.items);
  const total = calculateTotal(invoiceData.items, invoiceData.tax);
  const balance = calculateBalance(
    invoiceData.items,
    invoiceData.tax,
    invoiceData.paidTotal
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 text-black">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div
          ref={contentRef}
          className="print-area bg-white shadow-lg min-h-[279mm] flex flex-col"
        >
          {/* Sleek Modern Header */}
          <div className="px-8 pt-8 pb-6 border-b-4 border-orange-500">
            <div className="flex justify-between items-start mb-8">
              {/* Logo and Company Info */}
              <div className="flex items-center gap-4 -mt-3.5">
                <div className="">
                  <Image
                    src="/images/my-logo.png"
                    alt=""
                    width={150}
                    height={137}
                    className="logo"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 uppercase">
                    DanielBlac Devhub
                  </h2>
                  <div className="text-sm text-gray-600 space-y-0.5">
                    <p>1, Ayodele Awodeyi Close, Osera Estate</p>
                    <p>Osapa, Lekki, Lagos</p>
                    <p>+2349055316606</p>
                    <p>daniel_blac@yahoo.com</p>
                  </div>
                </div>
              </div>

              {/* Invoice Title */}
              <div className="text-right">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h1>
                <div className="inline-block bg-gray-900 text-white px-4 py-1 rounded">
                  <p className="text-sm font-semibold">
                    {invoiceData.invoiceNo}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Details Grid */}
            <div className="flex gap-6 pt-6 items-center justify-between px-4">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Invoice Date
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {invoiceData.invoiceDate}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Bill To
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {invoiceData.billTo.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Paid Total
                </p>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(invoiceData.paidTotal)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Balance Due
                </p>
                <p className="text-sm font-bold text-orange-600">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 py-6 flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 font-bold text-sm uppercase text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-3 font-bold text-sm uppercase text-gray-700">
                    Rate
                  </th>
                  <th className="text-center py-3 font-bold text-sm uppercase text-gray-700">
                    Qty
                  </th>
                  <th className="text-right py-3 font-bold text-sm uppercase text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-900">{item.description}</td>
                    <td className="py-4 text-right text-gray-700">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="py-4 text-center text-gray-700">
                      {item.qty}
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(calculateLineTotal(item.rate, item.qty))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-80">
                <div className="border border-gray-300">
                  <div className="flex justify-between p-2 text-sm">
                    <span className="uppercase font-semibold text-gray-600">
                      Subtotal
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 text-sm">
                    <span className="uppercase font-semibold text-gray-600">
                      Tax
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(invoiceData.tax)}
                    </span>
                  </div>
                </div>
                <div className="bg-orange-600 text-white flex items-center justify-between px-2 py-3 mt-0">
                  <span className="text-sm uppercase font-bold">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info & Terms */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {/* Account Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-orange-500"></div>
                  <h3 className="text-md font-bold text-gray-900 uppercase">
                    Account Information
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <p className="font-semibold">{invoiceData.customNote}</p>

                  {invoiceData.accountInfo.map((account, index) => (
                    <div key={account.id} className="space-y-1">
                      {index > 0 && (
                        <p className="font-bold text-orange-600 text-xs uppercase pt-2">
                          Alternate Account
                        </p>
                      )}
                      <p>
                        <strong>Account Number:</strong> {account.accountNumber}
                      </p>
                      <p>
                        <strong>Account Name:</strong> {account.accountName}
                      </p>
                      <p>
                        <strong>Bank:</strong> {account.bankName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-orange-500"></div>
                  <h3 className="text-md font-bold text-gray-900 uppercase">
                    Terms & Conditions
                  </h3>
                </div>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  {invoiceData.termsAndConditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 px-8 py-4 text-center mt-auto">
            <p className="font-bold text-sm text-white tracking-wide">
              THANK YOU FOR YOUR BUSINESS
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 flex gap-4 justify-center">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Edit size={20} />
            Edit Invoice
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            <Printer size={20} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editData && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">Edit Invoice</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    value={editData.invoiceNo}
                    onChange={(e) =>
                      setEditData({ ...editData, invoiceNo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="text"
                    value={editData.invoiceDate}
                    onChange={(e) =>
                      setEditData({ ...editData, invoiceDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bill To */}
              <div>
                <h3 className="text-lg font-bold mb-3">Bill To</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.billTo.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          billTo: { ...editData.billTo, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editData.billTo.address}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          billTo: {
                            ...editData.billTo,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Items</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {editData.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Rate (₦)
                            </label>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "rate",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Qty
                            </label>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(item.id, "qty", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {editData.items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Paid Total (₦)
                  </label>
                  <input
                    type="number"
                    value={editData.paidTotal}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        paidTotal: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tax (₦)
                  </label>
                  <input
                    type="number"
                    value={editData.tax}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        tax: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Account Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Account Information</h3>
                  <button
                    onClick={handleAddAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Account
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-semibold mb-2">
                    Custom Note
                  </label>
                  <textarea
                    value={editData.customNote}
                    onChange={(e) =>
                      setEditData({ ...editData, customNote: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
                <div className="space-y-3">
                  {editData.accountInfo.map((account, index) => (
                    <div
                      key={account.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={account.accountNumber}
                              onChange={(e) =>
                                handleAccountChange(
                                  account.id,
                                  "accountNumber",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Account Name
                            </label>
                            <input
                              type="text"
                              value={account.accountName}
                              onChange={(e) =>
                                handleAccountChange(
                                  account.id,
                                  "accountName",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={account.bankName}
                              onChange={(e) =>
                                handleAccountChange(
                                  account.id,
                                  "bankName",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {editData.accountInfo.length > 1 && (
                          <button
                            onClick={() => handleRemoveAccount(account.id)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Terms & Conditions</h3>
                  <button
                    onClick={handleAddTerm}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Term
                  </button>
                </div>
                <div className="space-y-2">
                  {editData.termsAndConditions.map((term, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) =>
                          handleTermChange(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter term..."
                      />
                      <button
                        onClick={() => handleRemoveTerm(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Display */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Subtotal:</span>
                  <span>
                    {formatCurrency(calculateSubtotal(editData.items))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Tax:</span>
                  <span>{formatCurrency(editData.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Paid Total:</span>
                  <span>{formatCurrency(editData.paidTotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Balance:</span>
                  <span>
                    {formatCurrency(
                      calculateBalance(
                        editData.items,
                        editData.tax,
                        editData.paidTotal
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernInvoiceApp;
