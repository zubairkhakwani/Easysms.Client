//React
import { useEffect, useState } from "react";

//Services
import {
  getAllPlatforms,
  addNewPlatform,
} from "../../../../../services/Platform/PlatformService";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Paginations
import Paginations from "../../../../Shared/Pagination";



//Css
import "./Platforms.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const twoDays = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 2,
);

function PlatformModal({ onClose, onConfirm, isSubmitting }) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button className="um-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="um-modal-title">Add New Platform</div>

        <div className="um-form-group">
          <label className="um-label">
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="text"
            placeholder="e.g. Facebook, Instagram..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Logo Url <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="text"
            placeholder="e.g. https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Description{" "}
            <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            className="um-input"
            placeholder="Short description of this platform..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="um-modal-actions">
          <button className="um-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`um-btn ${!isSubmitting ? "primary" : ""}`}
            disabled={isSubmitting || !name.trim()}
            onClick={() =>
              onConfirm({
                name: name.trim(),
                description: description.trim(),
                logoUrl: logoUrl.trim(),
              })
            }
          >
            {isSubmitting ? <div className="ph-spinner" /> : <span> Add</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Platforms() {
  //Filtering
  const [startDate, setStartDate] = useState(toDS(twoDays));
  const [endDate, setEndDate] = useState(toDS(today));

  //Data
  const [platforms, setPlatforms] = useState([]);

  //Loading
  const [applied, setApplied] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingPlatform, setIsAddingPlatform] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Modal
  const [modal, setModal] = useState(false);

  //Use Effects
  useEffect(() => {
    getPlatformData();
  }, [pageNo, pageSize]);

  //Fetch Data From Api
  async function getPlatformData() {
    setIsLoading(true);
    try {
      let response = await getAllPlatforms({
        pageNo,
        pageSize,
      });
      var responseMessage = response.message;
      var responseData = !response.data ? [] : response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setPlatforms(responseData?.items ?? []);
      setCount(responseData.count);
    } finally {
      setApplied({});
      setIsLoading(false);
    }
  }

  //Handle Filters
  const handleApply = async () => {
    await getPlatformData();
  };

  const handleReset = async () => {
    setStartDate(toDS(twoDays));
    setEndDate(toDS(today));
    setPageSize(10);
    setPageNo(0);
  };

  //Platorm
  const handleAddPlatform = async (data) => {
    setIsAddingPlatform(true);
    let response = await addNewPlatform(data);
    let responseMessage = response?.message;
    if (response.isSuccess) {
      successTaost(responseMessage);
      setPlatforms((previous) => [response.data, ...previous]);
    } else {
      errorToast(responseMessage);
    }
    setIsAddingPlatform(false);
  };

  //Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  //Modal
  const OpenPlatformModal = async () => {
    setModal(true);
  };
  const closePlatformModal = () => setModal(false);

  return (
    <div className="ph-page">
      {/* ── Filters ── */}
      <div className="ph-filters">
        <div className="ph-filter-field">
          <label className="ph-filter-label">From Date</label>
          <input
            type="date"
            className="ph-filter-input"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="ph-filter-field">
          <label className="ph-filter-label">To Date</label>
          <input
            type="date"
            className="ph-filter-input"
            value={endDate}
            min={startDate}
            max={toDS(today)}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="ph-filter-actions">
          <button className="ph-reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button
            className="ph-apply-btn"
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="btn-spinner"
                  style={{
                    width: 13,
                    height: 13,
                    borderTopColor: "#000",
                    borderColor: "rgba(0,0,0,0.25)",
                  }}
                />{" "}
                Fetching…
              </>
            ) : (
              "✦ Apply"
            )}
          </button>
          <button className="ph-apply-btn" onClick={OpenPlatformModal}>
            ✦ Add new
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Provider History</span>
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Admin</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="ph-col-id">{r.name}</td>
                      <td className="um-user-name">
                        {r.description && r.description.length > 0
                          ? r.description
                          : "-"}
                      </td>
                      <td className="um-user-cell">
                        <div>
                          <div className="um-user-name">{r.createdByName}</div>
                          <div className="um-user-email">
                            {r.createdByEmail}
                          </div>
                        </div>
                      </td>
                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.createdAt)}
                      </td>
                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.updatedAt)}
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
        {!isLoading && applied && platforms.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}

        {/* Paginations */}
        {!isLoading && applied && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}

        {/* Modal */}
        {modal && (
          <PlatformModal
            onClose={closePlatformModal}
            onConfirm={handleAddPlatform}
            isSubmitting={isAddingPlatform}
          />
        )}
      </div>
    </div>
  );
}
