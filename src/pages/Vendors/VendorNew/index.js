import React, { useEffect, useRef, useState } from "react";

import VendorForm from "../../../components/forms/VendorForm";
import BrokerFrom from "../../../components/forms/BrokerForm";
import TableComponent from "../../../components/common/TableComponent";
import ContactModal from "../../../components/modals/ContactModal";

import { breakLabelText } from "../../../utils/breakLabelText";

const VendorNew = () => {
  const [showBrokerForm, setShowBrokerForm] = useState(false);

  const [formTypes, setFormTypes] = useState({
    vendor: "add",
    broker: "add",
    contact: "add",
  });

  const [dataIds, setDataIds] = useState({
    vendor: null,
    broker: null,
    contact: null,
  });

  const [openContactModal, setOpenContactModal] = useState(false);

  const [contactFrom, setContactFrom] = useState("vendor");
  const [contacts, setContacts] = useState([]);

  const [primaryID, setPrimaryID] = useState({
    vendor: null,
    broker: null,
  });

  const contactFromRef = useRef(null);

  const tableHeaders = [
    { id: "Contact_Name", label: breakLabelText("Contact Name") },
    { id: "Main_Phone", label: breakLabelText("Contact Phone Number") },
    { id: "Mobile_Number", label: breakLabelText("Contact Mobile Number") },
    { id: "Title", label: breakLabelText("Contact Title") },
    { id: "Email", label: breakLabelText("Contact Email Address") },
    { id: "more", label: "" },
  ];

  const handleEdit = (row) => {
    setFormTypes((prevData) => ({
      ...prevData,
      contact: "update",
    }));
    setDataIds((prevData) => ({
      ...prevData,
      contact: row.ContactID,
    }));
    setOpenContactModal(true);
  };

  const handleDelete = (row) => {
    setFormTypes((prevData) => ({
      ...prevData,
      contact: "delete",
    }));
    setDataIds((prevData) => ({
      ...prevData,
      contact: row.ContactID,
    }));
    setOpenContactModal(true);
  };

  const primaryContactHandler = () => {};

  return (
    <div className="py-5">
      <div className="p-5 flex flex-col sm:flex-row gap-5">
        <VendorForm
          formType={formTypes.vendor}
          setFormTypes={setFormTypes}
          dataIds={dataIds}
          setDataIds={setDataIds}
          contactFrom={contactFrom}
          setContactFrom={setContactFrom}
          contacts={contacts}
          setContacts={setContacts}
          showBrokerForm={showBrokerForm}
          setShowBrokerForm={setShowBrokerForm}
          contactFromRef={contactFromRef}
          primaryID={primaryID.vendor}
        />
        {showBrokerForm ? (
          <BrokerFrom
            formType={formTypes.broker}
            setFormTypes={setFormTypes}
            dataIds={dataIds}
            setDataIds={setDataIds}
            contactFrom={contactFrom}
            setContactFrom={setContactFrom}
            contacts={contacts}
            setContacts={setContacts}
            setShowBrokerForm={setShowBrokerForm}
            contactFromRef={contactFromRef}
            primaryID={primaryID.broker}
          />
        ) : (
          <div>
            <button
              className="bg-BtnBg text-white rounded-xl py-2 px-7"
              onClick={() => {
                setFormTypes((prevData) => ({
                  ...prevData,
                  broker: "add",
                }));
                setShowBrokerForm(true);
              }}
            >
              Add New Broker
            </button>
          </div>
        )}
      </div>
      <div className="px-5 flex items-center">
        <button
          className="bg-BtnBg text-white rounded-xl py-2 px-7"
          onClick={() => {
            setFormTypes((prevData) => ({
              ...prevData,
              contact: "add",
            }));
            setOpenContactModal(true);
          }}
        >
          Add New Contact
        </button>

        <p className="flex-1 text-center text-BtnBg font-bold text-2xl capitalize">
          {contactFrom}
          <span ref={contactFromRef}></span>
        </p>
        <button className="opacity-0 invisible pointer-events-none">
          Add New Contact
        </button>
      </div>
      <div className="p-5">
        <TableComponent
          tableHeaders={tableHeaders}
          data={contacts}
          circleName={"Contact_Name"}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAvatarClick={primaryContactHandler}
          primaryID={primaryID[contactFrom]}
          setPrimaryID={(id) =>
            setPrimaryID((prev) => {
              let tmp = { ...prev };
              tmp[contactFrom] = id;
              return tmp;
            })
          }
        />
      </div>
      {openContactModal && (
        <ContactModal
          open={true}
          handleClose={() => {
            setOpenContactModal(false);
          }}
          formType={formTypes.contact}
          dataIds={dataIds}
          setDataIds={setDataIds}
          contacts={contacts}
          setContacts={setContacts}
        />
      )}
    </div>
  );
};

export default VendorNew;
