"use client";

// ============================================
// ADDRESSES PAGE
// ============================================

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Modal } from "@/components/ui";

// ============================================
// MOCK DATA
// ============================================

interface Address {
  id: string;
  type: "shipping" | "billing";
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    type: "shipping",
    isDefault: true,
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "Toronto",
    state: "ON",
    postcode: "M5V 1A1",
    country: "Canada",
    phone: "(416) 555-1234",
  },
  {
    id: "2",
    type: "billing",
    isDefault: true,
    firstName: "John",
    lastName: "Doe",
    company: "Acme Corp",
    address1: "456 Business Ave",
    city: "Toronto",
    state: "ON",
    postcode: "M5V 2B2",
    country: "Canada",
    phone: "(416) 555-5678",
  },
];

// ============================================
// ADDRESS CARD
// ============================================

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div
      className={cn(
        "border p-4 relative",
        address.isDefault ? "border-red-primary" : "border-gray-border"
      )}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <span className="absolute -top-3 left-4 px-2 py-0.5 bg-red-primary text-white text-tiny font-semibold uppercase">
          Default
        </span>
      )}

      {/* Address Type */}
      <p className="text-tiny text-gray-medium uppercase mb-2 font-semibold">
        {address.type === "shipping" ? "Shipping Address" : "Billing Address"}
      </p>

      {/* Address Details */}
      <div className="text-small space-y-1 mb-4">
        <p className="font-semibold">
          {address.firstName} {address.lastName}
        </p>
        {address.company && <p>{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.state} {address.postcode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="text-gray-medium">{address.phone}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-3 py-2 text-tiny font-semibold uppercase border border-gray-border hover:border-black transition-colors"
        >
          <Edit2 size={14} strokeWidth={1.5} />
          Edit
        </button>
        {!address.isDefault && (
          <>
            <button
              onClick={onSetDefault}
              className="inline-flex items-center gap-1 px-3 py-2 text-tiny font-semibold uppercase border border-gray-border hover:border-black transition-colors"
            >
              <Check size={14} strokeWidth={1.5} />
              Set Default
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1 px-3 py-2 text-tiny font-semibold uppercase border border-gray-border text-error hover:border-error transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENT
// ============================================

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const shippingAddresses = addresses.filter((a) => a.type === "shipping");
  const billingAddresses = addresses.filter((a) => a.type === "billing");

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string, type: "shipping" | "billing") => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.type === type ? a.id === id : a.isDefault,
      }))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-h2 uppercase mb-2">
            Addresses
          </h1>
          <p className="text-body text-gray-medium">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingAddress(null);
            setShowAddModal(true);
          }}
          leftIcon={<Plus size={18} strokeWidth={1.5} />}
        >
          Add Address
        </Button>
      </div>

      {/* Shipping Addresses */}
      <div>
        <h2 className="font-heading font-bold text-h4 uppercase mb-4 flex items-center gap-2">
          <MapPin size={20} strokeWidth={1.5} />
          Shipping Addresses
        </h2>
        {shippingAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shippingAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id, "shipping")}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-gray-light text-center">
            <MapPin size={32} strokeWidth={1} className="mx-auto mb-3 text-gray-medium" />
            <p className="text-small text-gray-medium mb-4">
              No shipping addresses saved yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingAddress(null);
                setShowAddModal(true);
              }}
            >
              Add Shipping Address
            </Button>
          </div>
        )}
      </div>

      {/* Billing Addresses */}
      <div>
        <h2 className="font-heading font-bold text-h4 uppercase mb-4 flex items-center gap-2">
          <MapPin size={20} strokeWidth={1.5} />
          Billing Addresses
        </h2>
        {billingAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {billingAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id, "billing")}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-gray-light text-center">
            <MapPin size={32} strokeWidth={1} className="mx-auto mb-3 text-gray-medium" />
            <p className="text-small text-gray-medium mb-4">
              No billing addresses saved yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingAddress(null);
                setShowAddModal(true);
              }}
            >
              Add Billing Address
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <div className="p-4">
          <p className="text-small text-gray-medium mb-4">
            Address form will be implemented here with fields for:
          </p>
          <ul className="text-small text-gray-medium list-disc pl-4 space-y-1">
            <li>Address type (Shipping/Billing)</li>
            <li>First & Last Name</li>
            <li>Company (optional)</li>
            <li>Street Address</li>
            <li>City, State/Province, Postal Code</li>
            <li>Country</li>
            <li>Phone Number</li>
          </ul>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary">Save Address</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
