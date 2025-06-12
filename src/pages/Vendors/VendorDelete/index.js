import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import axios from "../../../api";
import VendorForm from "../../../components/forms/VendorForm";
import BrokerFrom from "../../../components/forms/BrokerForm";
import TableComponent from "../../../components/common/TableComponent";

import { breakLabelText } from "../../../utils/breakLabelText";

const VendorDelete = () => {
  const location = useLocation();

  const { id } = location.state || {};

  const [formTypes, setFormTypes] = useState({
    vendor: "delete",
    broker: "delete",
  });

  const [dataIds, setDataIds] = useState({
    vendor: null,
    broker: null,
  });

  const [showBrokerForm, setShowBrokerForm] = useState(false);

  const [contactFrom, setContactFrom] = useState("vendor");
  const [contacts, setContacts] = useState([]);

  const tableHeaders = [
    { id: "Contact_Name", label: breakLabelText("Contact Name") },
    { id: "Main_Phone", label: breakLabelText("Contact Phone Number") },
    { id: "Mobile_Number", label: breakLabelText("Contact Mobile Number") },
    { id: "Title", label: breakLabelText("Contact Title") },
    { id: "Email", label: breakLabelText("Contact Email Address") },
  ];

  useEffect(() => {
    if (id) {
      axios
        .get(`/vendors/${id}`)
        .then((res) => {
          const data = res.data.data;
          if (data && data.BrokerID) {
            setShowBrokerForm(true);
            setDataIds((prevData) => ({
              ...prevData,
              vendor: id,
              broker: data.BrokerID,
            }));
            setFormTypes((prevData) => ({
              ...prevData,
              broker: "delete",
            }));
          }
        })
        .catch((err) => {
          console.error(err);
          setDataIds((prevData) => ({
            ...prevData,
            vendor: id,
            broker: null,
          }));
          setFormTypes((prevData) => ({
            ...prevData,
            broker: "add",
          }));
        });
    } else {
      setDataIds((prevData) => ({
        ...prevData,
        vendor: null,
        broker: null,
      }));
      setFormTypes((prevData) => ({
        ...prevData,
        broker: "add",
      }));
    }
  }, [id]);

  return (
    <div className="py-5">
      <div className="p-5 flex flex-col sm:flex-row gap-5">
        <VendorForm
          formType={formTypes.vendor}
          setFormType={setFormTypes}
          dataIds={dataIds}
          setDataIds={setDataIds}
          contactFrom={contactFrom}
          setContactFrom={setContactFrom}
          contacts={contacts}
          setContacts={setContacts}
          showBrokerForm={showBrokerForm}
          setShowBrokerForm={setShowBrokerForm}
        />
        {showBrokerForm && (
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
          />
        )}
      </div>
      <div className="px-5 flex items-center">
        <p className="flex-1 text-center text-BtnBg font-bold text-2xl">
          {contactFrom}
        </p>
      </div>
      <div className="p-5">
        <TableComponent
          tableHeaders={tableHeaders}
          data={contacts}
          circleName={"Contact_Name"}
          disable={true}
        />
      </div>
    </div>
  );
};

export default VendorDelete;
