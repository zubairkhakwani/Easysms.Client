//React
import { useState, useEffect } from "react";

//Serives
import {
  getAllPhysical,
  togglePhysicalNumberActive,
  updatePhysicalNumberExpiry,
} from "../../../../../services/Number/NumberService";
import { getPhysicalCountries } from "../../../../../services/Provider/ProviderService";

//Toaster
import { errorToast, successTaost } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

//Static
import { PhysicalNumberStatus, modalKeys } from "../../../../../data/Static";

//DropDown
import { PhysicalNumberActionDropdown } from "../../../../Helper/PhysicalNumber/DropDown/PhysicalNumberActionDropDown";

//Modals
import ToggleStatusModal from "../../../../Helper/ContactUs/Modal/ToggleStatusModal";
import UpdatePhysicalNumberExpiryModal from "../../../../Helper/PhysicalNumber/Modal/UpdatePhysicalNumberExpiryModal";

//Pagination
import Paginations from "../../../../Shared/Pagination";
import "../../../../Order/NumberHistory/NumberHistory.css";
import "../User/UserManagement.css";

const defaultFilters = {
  status: "0",
  orderByCancellationCountDesc: false,
  countryId: "",
};

export function PhysicalNumbers() {
  const [physicalNumbers, setPhysicalNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isUpdatingExpiry, setIsUpdatingExpiry] = useState(false);
  const [modal, setModal] = useState("");
  const [selectedNumber, setSelectedNumber] = useState({
    id: "",
    isActive: true,
    expiresAt: "",
  });

  // Draft filters — edited in the UI; applied only when user clicks Apply.
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [countryOptions, setCountryOptions] = useState([]);

  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  async function getPhysicalNumbersData() {
    setIsLoading(true);
    try {
      const response = await getAllPhysical({
        pageNo,
        pageSize,
        filters: appliedFilters,
      });
      if (response.isSuccess) {
        setPhysicalNumbers(response.data.items ?? []);
        setCount(response.data.count);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to fetch physical numbers");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPhysicalCountries()
      .then((list) =>
        setCountryOptions(
          (list ?? []).map((c) => ({
            value: c.countryId,
            label: c.countryName,
          })),
        ),
      )
      .catch(() => {});
  }, []);

  // Fetch on pagination or after Apply (appliedFilters), not on every dropdown change.
  useEffect(() => {
    getPhysicalNumbersData();
  }, [pageNo, pageSize, appliedFilters]);

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setPageNo(0);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPageNo(0);
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const closeModal = () => setModal("");

  const openModal = (key, physicalNumberId) => {
    const row = physicalNumbers.find((obj) => obj.id === physicalNumberId);
    setSelectedNumber({
      id: physicalNumberId,
      isActive: row?.isActive ?? true,
      expiresAt: row?.expiresAt ?? "",
    });
    setModal(key);
  };

  async function handleTogglePhysicalNumberActive() {
    setIsToggling(true);
    try {
      const response = await togglePhysicalNumberActive(selectedNumber.id);

      if (response.isSuccess) {
        const responseData = response.data;
        setPhysicalNumbers((previous) =>
          previous.map((item) =>
            item.id === selectedNumber.id
              ? { ...item, isActive: responseData.isActive }
              : item,
          ),
        );

        successTaost(response.message);
        closeModal();
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to perform action");
    } finally {
      setIsToggling(false);
    }
  }

  async function handleUpdatePhysicalNumberExpiry(expiresAt) {
    setIsUpdatingExpiry(true);
    try {
      const response = await updatePhysicalNumberExpiry(
        selectedNumber.id,
        expiresAt,
      );

      if (response.isSuccess) {
        const responseData = response.data;
        setPhysicalNumbers((previous) =>
          previous.map((item) =>
            item.id === selectedNumber.id
              ? {
                  ...item,
                  expiresAt: responseData.expiresAt,
                  isExpired: responseData.isExpired,
                  daysRemaining: responseData.daysRemaining,
                }
              : item,
          ),
        );

        successTaost(response.message);
        closeModal();
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to update expiry date");
    } finally {
      setIsUpdatingExpiry(false);
    }
  }

  return (
    <div className="ph-page">
      <div className="nh-filters-bar">
        <div className="nh-filters-left">
          <span className="nh-filters-heading">Filters</span>

          <div className="nh-filter-group">
            <label className="nh-filter-label">Status</label>
            <select
              className="nh-filter-select"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {PhysicalNumberStatus.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="nh-filter-group">
            <label className="nh-filter-label">Country</label>
            <select
              className="nh-filter-select"
              value={filters.countryId}
              onChange={(e) => setFilter("countryId", e.target.value)}
            >
              <option value="">All</option>
              {countryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="nh-filter-group">
            <label className="nh-filter-label">OTP</label>
            <label className="nh-filter-checkbox">
              <input
                type="checkbox"
                checked={filters.orderByCancellationCountDesc}
                onChange={(e) =>
                  setFilter("orderByCancellationCountDesc", e.target.checked)
                }
              />
              Order By Cancellation Count
            </label>
          </div>
        </div>

        <div className="nh-filter-actions">
          <button type="button" className="nh-clear-btn" onClick={clearFilters}>
            Reset
          </button>
          <button
            type="button"
            className="nh-apply-btn"
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
        </div>
      </div>

      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Physical Numbers</span>
        </div>

        {!isLoading && (
          <div className="ph-table-wrap">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>Country</th>
                  <th>Number</th>
                  <th>Url</th>
                  <th>Purchased Price</th>
                  <th>Cancelled Count</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Expiry Date</th>
                  <th>Days Remaining</th>
                  <th>Expired</th>
                  <th>Created At</th>
                  <th>Sold At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {physicalNumbers.map((r, index) => (
                  <tr key={r.id}>
                    <td className="ph-col-id">{index + 1}</td>
                    <td className="ph-col-id">{r.id}</td>
                    <td className="ph-col-id">{r.countryName || r.countryId}</td>
                    <td className="ph-col-id">{r.number}</td>
                    <td className="ph-col-id">{r.url}</td>
                    <td className="ph-col-id">
                      {FormatterHelper.formatCurrency(r.purchasedPrice)}
                    </td>
                    <td className="ph-col-id">{r.cancelledCount}</td>
                    <td className="ph-col-id">{r.status}</td>
                    <td>
                      <span
                        className={`ph-status ${r.isActive ? "Active" : "Cancelled"} `}
                      >
                        {r.isActive ? "Active for sale" : "Inactive"}
                      </span>
                    </td>
                    <td className="ph-col-date">
                      {FormatterHelper.formatDateToLocal(r.expiresAt)}
                    </td>
                    <td className="ph-col-id">{r.daysRemaining ?? 0}</td>
                    <td>
                      <span
                        className={`ph-status ${r.isExpired ? "Cancelled" : "Active"}`}
                      >
                        {r.isExpired ? "Expired" : "No"}
                      </span>
                    </td>
                    <td className="ph-col-date">
                      {FormatterHelper.formatDateToLocal(r.createdAt)}
                    </td>
                    <td className="ph-col-date">
                      {r.soldAt
                        ? FormatterHelper.formatDateToLocal(r.soldAt)
                        : "- "}
                    </td>
                    <td>
                      <PhysicalNumberActionDropdown
                        physicalNumberId={r.id}
                        onAction={openModal}
                        isActive={r.isActive}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {!isLoading && physicalNumbers.length === 0 && (
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

      {modal === modalKeys.physicalNumberActive && (
        <ToggleStatusModal
          isActive={selectedNumber.isActive}
          onClose={closeModal}
          onConfirm={handleTogglePhysicalNumberActive}
          isLoading={isToggling}
          config={{
            activeLabel: "Active for sale",
            inactiveLabel: "Inactive",
            activeIcon: "✅",
            inactiveIcon: "🚫",
            activeClass: "success",
            inactiveClass: "warning",
          }}
        />
      )}

      {modal === modalKeys.physicalNumberExpiry && (
        <UpdatePhysicalNumberExpiryModal
          expiresAt={selectedNumber.expiresAt}
          onClose={closeModal}
          onConfirm={handleUpdatePhysicalNumberExpiry}
          isLoading={isUpdatingExpiry}
        />
      )}
    </div>
  );
}
