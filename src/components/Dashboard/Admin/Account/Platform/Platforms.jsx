//React
import { useEffect, useState } from "react";

//Services
import {
  getAllAdminPlatforms,
  upsertPlatform,
} from "../../../../../services/Platform/PlatformService";

//Modals
import UpsertPlatformModal from "../../../../Helper/Modals/Platform/UpsertPatformModal";
import DynamicFormBuilder from "./DynamicFormBuilder";

//Action DropDown
import { PlatformActionDropDown } from "../../../../Helper/Modals/Platform/PlatformActionDropDown";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Static Data
import { modalKeys } from "../../../../../data/Static";

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

export default function Platforms() {
  //Filtering
  const [startDate, setStartDate] = useState(toDS(twoDays));
  const [endDate, setEndDate] = useState(toDS(today));

  //Data
  const [platforms, setPlatforms] = useState([]);

  //Loading
  const [applied, setApplied] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlatformUpserting, setIsPlatformUpserting] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Modal
  const [modal, setModal] = useState([]);

  //Dynamic Form Builder
  const [unSavedPlatformData, setUnSavedPlatformData] = useState({
    id: undefined,
    name: "",
    logoUrl: "",
    description: "",
    configuration: "",
  });

  //Use Effects
  useEffect(() => {
    getPlatformData();
  }, [pageNo, pageSize]);

  //Fetch Data From Api
  async function getPlatformData() {
    setIsLoading(true);
    try {
      let response = await getAllAdminPlatforms({
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
  const handleAddPlatform = async (configuration = null, platformData) => {
    console.log(platformData);
    platformData.configuration = configuration;

    setIsPlatformUpserting(true);
    console.log("Configuration", configuration);
    console.log("Data", platformData);
    try {
      let response = await upsertPlatform(platformData);
      let responseMessage = response.message;
      let responseData = response.data;
      if (response.isSuccess) {
        successTaost(responseMessage);

        if (platformData.id) {
          setPlatforms((previous) =>
            previous.map((platform) =>
              platform.id === responseData.id ? responseData : platform,
            ),
          );
        } else {
          setPlatforms((previous) => [responseData, ...previous]);
        }
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to perform operation, please try later.");
    } finally {
      setIsPlatformUpserting(false);
    }
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
  const handelOpenModal = async (key, id) => {
    //update request
    if (id) {
      let platform = platforms.find((p) => p.id === id);
      setUnSavedPlatformData(platform);
    } else {
      setUnSavedPlatformData({
        name: "",
        logoUrl: "",
        description: "",
        configuration: "",
      });
    }

    setModal((prev) => [...prev, key]);
  };

  const handleCloseModal = (key) => {
    setModal((prev) => prev.filter((item) => item !== key));
  };

  const handleOpenPlatformConfigureModal = async (plaformData, key) => {
    setUnSavedPlatformData(plaformData);
    setModal((prev) => [...prev, key]);
  };

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
          <button
            className="ph-apply-btn"
            onClick={() => handelOpenModal(modalKeys.upsertPlatform)}
          >
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
                    <th>Action</th>
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
                        {r.updatedAt
                          ? FormatterHelper.formatDateToLocal(r.updatedAt)
                          : "-"}
                      </td>

                      <td>
                        <PlatformActionDropDown
                          platformId={r.id}
                          onAction={handelOpenModal}
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
        {modal.includes(modalKeys.upsertPlatform) && (
          <UpsertPlatformModal
            unSavedData={unSavedPlatformData}
            onClose={handleCloseModal}
            onConfigure={handleOpenPlatformConfigureModal}
            onUpsertPlatform={handleAddPlatform}
            isUpserting={isPlatformUpserting}
          />
        )}
        {/* Dynamic Form Builder */}
        {modal.includes(modalKeys.platformConfiguration) && (
          <DynamicFormBuilder
            isUpserting={isPlatformUpserting}
            unSavedData={unSavedPlatformData}
            onClose={handleCloseModal}
            onSave={handleAddPlatform}
          />
        )}
      </div>
    </div>
  );
}
