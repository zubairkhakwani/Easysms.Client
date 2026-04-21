//React
import { useEffect, useState } from "react";

//Services
import { getAllContactUs } from "../../../../../services/ContactUs/ContactUsService";

//Helper
import { errorToast } from "../../../../../helper/Toaster";

import { FormatterHelper } from "../../../../../helper/FormatterHelper";

import Paginations from "../../../../Shared/Pagination";

//Css
import "./ContactUs.css";

export default function ContactUs() {
  //Data
  const [contactUs, setContactUs] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

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
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Is Read</th>
                    <th>Read By</th>
                    <th>Created At</th>
                    <th>Read At</th>
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
                        <div>
                          <div className="um-user-name">{r.readyByName}</div>
                          <div className="um-user-email">{r.readyByEmail}</div>
                        </div>
                      </td>

                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.createdAt)}
                      </td>
                      <td className="ph-col-date">
                        {r.readAt
                          ? FormatterHelper.formatDateToLocal(r.date)
                          : "-"}
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
    </div>
  );
}
