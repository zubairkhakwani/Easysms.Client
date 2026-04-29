//React
import { useEffect, useState } from "react";

//Services
import {
  getAllContactUs,
  toggleContactUsMessage,
} from "../../../../../services/ContactUs/ContactUsService";

import { ActionDropdown } from "../../../../Helper/ContactUs/DropDown/ActionDropDown";
import ToggleMessageReadModal from "../../../../Helper/ContactUs/Modal/ToggleMessageReadModal";

//Helper
import { errorToast, successTaost } from "../../../../../helper/Toaster";
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { modalKeys } from "../../../../../data/Static";

//Paginations
import Paginations from "../../../../Shared/Pagination";

//Css
import "./ContactUs.css";

export default function ContactUs() {
  //Data
  const [contactUs, setContactUs] = useState([]);
  const [message, setMessage] = useState({ id: "", isRead: false });
  const [modal, setModal] = useState();

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  async function getContactUsData() {
    setIsLoading(true);
    try {
      let response = await getAllContactUs();
      var responseMessage = response.message;
      var responseData = !response.data ? [] : response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setContactUs(responseData?.items ?? []);
      setCount(responseData.count);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getContactUsData();
  }, [pageNo, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  async function handleToggleContactUs() {
    setIsToggling(true);
    try {
      let response = await toggleContactUsMessage(message.id);

      if (response.isSuccess) {
        const responseData = response.data;
        setContactUs((previous) =>
          previous.map((item) =>
            item.id === message.id
              ? {
                  ...item,
                  isRead: responseData.isRead,
                  readyByName: responseData.readyByName,
                  readyByEmail: responseData.readyByEmail,
                  readtAt: responseData.readAt,
                }
              : item,
          ),
        );

        successTaost(response.message);
        setModal();
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to perform action");
    } finally {
      setIsToggling(false);
    }
  }

  const openModal = (key, contactUsId) => {
    let messageObj = contactUs.find((obj) => obj.id === contactUsId);

    setMessage({
      id: contactUsId,
      isRead: messageObj.isRead,
    });

    setModal(key);
  };

  const closeModal = () => setModal();

  return (
    <div className="ph-page">
      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Contact us</span>
        </div>
        {/* Table */}
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Is Read</th>
                    <th>Read By</th>
                    <th>Created At</th>
                    <th>Read At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactUs.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="um-user-name">{r.firstName}</td>
                      <td className="um-user-email">{r.lastName}</td>

                      <td className="ph-col-phone">{r.email}</td>
                      <td className="ph-col-phone">
                        {r.whatsappNumber
                          ? FormatterHelper.formatPhoneNumber(r.whatsappNumber)
                          : "-"}
                      </td>
                      <td className="ph-col-phone">{r.subject}</td>

                      <td className="ph-col-sms" title={r.message}>
                        {r.message}
                      </td>

                      <td>
                        <span
                          className={`ph-status ${r.isRead ? "Active" : "Cancelled"} `}
                        >
                          {r.isRead ? "true" : "false"}
                        </span>
                      </td>
                      <td className="um-user-cell">
                        {r.readyByName ? (
                          <div>
                            <div className="um-user-name">{r.readyByName}</div>
                            <div className="um-user-email">
                              {r.readyByEmail}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.createdAt)}
                      </td>
                      <td className="ph-col-date">
                        {r.readAt
                          ? FormatterHelper.formatDateToLocal(r.date)
                          : "-"}
                      </td>

                      <td>
                        <ActionDropdown
                          contactUsId={r.id}
                          onAction={openModal}
                          isRead={r.isRead}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}
        {/* Empty result */}
        {!isLoading && contactUs.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}

        {!isLoading && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>

      {modal === modalKeys.contactUsMessage && (
        <ToggleMessageReadModal
          isRead={message.isRead}
          isLoading={isToggling}
          onClose={closeModal}
          onConfirm={handleToggleContactUs}
        />
      )}
    </div>
  );
}
