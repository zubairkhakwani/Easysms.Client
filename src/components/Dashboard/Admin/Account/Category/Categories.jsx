//React
import { useEffect, useState } from "react";

//Services
import {
  getAllCategories,
  addNewCategory,
} from "../../../../../services/Category/CategoryService";

import { getAllPlatforms } from "../../../../../services/Platform/PlatformService";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Paginations
import Paginations from "../../../../Shared/Pagination";

//Css
import "./Categories.css";

function CategoryModal({ onClose, onConfirm, isSubmitting, platforms }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState();

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button className="um-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="um-modal-title">Add New Category</div>

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
        <div className="ph-filter-field">
          <label className="ph-filter-label">Platforms</label>
          <select
            className="ph-filter-input"
            onChange={(e) => setPlatform(e.target.value)}
            disabled={platforms.length == 0}
          >
            <option value="">
              {platforms.length == 0
                ? "No platform availble"
                : "Select platform"}
            </option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="um-modal-actions">
          <button className="um-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`um-btn ${!isSubmitting ? "primary" : ""}`}
            disabled={isSubmitting || !name.trim() || !platform}
            onClick={() =>
              onConfirm({
                name: name.trim(),
                description: description.trim(),
                platformId: platform,
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

export default function Categories() {
  //Filtering
  const [platform, setPlatform] = useState(0);

  //Data
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  //Loading
  const [applied, setApplied] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Modal
  const [modal, setModal] = useState(false);

  //Use Effects
  useEffect(() => {
    getCategoryData();
  }, [pageNo, pageSize]);

  useEffect(() => {
    getPlatformData();
  }, []);

  //Fetch Data From Api
  async function getCategoryData() {
    setIsLoading(true);

    let responseMessage = "";
    let responseData = [];

    try {
      let response = await getAllCategories({
        pageNo,
        pageSize,
        platformId: platform,
      });

      responseMessage = response.message;

      if (!response.isSuccess) {
        errorToast(responseMessage);
      } else {
        responseData = response.data?.items ?? [];
      }
    } catch {
      errorToast("Unable to load categories. Please try again.");
    } finally {
      setApplied({});
      setIsLoading(false);
      setCategories(responseData);
      setCount(responseData.length);
    }
  }

  async function getPlatformData() {
    let responseMessage = "";
    let responseData = [];

    try {
      let response = await getAllPlatforms({ pageNo, pageSize });
      responseMessage = response.message;

      if (!response.isSuccess) {
        errorToast(responseMessage);
      } else {
        responseData = response.data?.items ?? [];
      }
    } catch {
      errorToast("Unable to load platforms. Please try again.");
    } finally {
      setPlatforms(responseData);
    }
  }

  //Handle Filters
  const handleApply = async () => {
    await getCategoryData();
  };

  const handleReset = async () => {
    setPlatform(0);
    setPageSize(10);
    setPageNo(0);
  };

  //Categories
  const handleAddCategory = async (data) => {
    setIsAddingCategory(true);

    let response = await addNewCategory(data);
    let responseMessage = response?.message;
    if (response.isSuccess) {
      successTaost(responseMessage);
      setCategories((previous) => [response.data, ...previous]);
    } else {
      errorToast(responseMessage);
    }
    setIsAddingCategory(false);
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
          <label className="ph-filter-label">Platforms</label>
          <select
            className="ph-filter-input"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value={"0"}>All</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
          <span className="ph-table-title">Platform Categories</span>
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
                    <th>Platform</th>
                    <th>Admin</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="ph-col-id">{r.name}</td>
                      <td className="um-user-name">
                        {r.description && r.description.length > 0
                          ? r.description
                          : "-"}
                      </td>
                      <td className="um-user-name">{r.platform}</td>
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
                        {r.updatedAt
                          ? FormatterHelper.formatDateToLocal(r.updatedAt)
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
        {!isLoading && applied && categories.length === 0 && (
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
          <CategoryModal
            onClose={closePlatformModal}
            onConfirm={handleAddCategory}
            isSubmitting={isAddingCategory}
            platforms={platforms}
          />
        )}
      </div>
    </div>
  );
}
