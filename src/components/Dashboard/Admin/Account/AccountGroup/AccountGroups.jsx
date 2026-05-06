//React
import { useEffect, useState } from "react";

//Services
import {
  getAllAccountGroups,
  addNewAccountGroup,
} from "../../../../../services/AccountGroup/AccountGroup.js";
import { addNewAccount } from "../../../../../services/Account/Account.js";
import { getAllLookups } from "../../../../../services/Lookup/Lookup.js";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Paginations
import Paginations from "../../../../Shared/Pagination";

//Modals
import { AccountGroupModal } from "../../../../Helper/Modals/AccountGroup/AccountGroupModal.jsx";
import { AddAccountModal } from "../../../../Helper/Modals/AccountGroup/AddAccountModal.jsx";
import { ResultModal } from "../../../../Helper/Modals/AccountGroup/ResultModal.jsx";

//DropDowns
import { ActionDropdown } from "../../../../Helper/DropDown/ActionDropDown.jsx";

//Helper
import { modalKeys } from "../../../../../data/Static.js";

//Css
import "./AccountGroups.css";

export default function AccountGroups() {
  //Data
  const [accountGroups, setAccountGroups] = useState([]);
  const [lookups, setLookups] = useState([]);
  const [categories, setCategories] = useState([]);

  const [accountGroupConfig, setAccountGroupConfig] = useState({
    accountGroupId: undefined,
    plaformId: undefined,
    categoryId: undefined,
    unitPrice: undefined,
    descripion: "",
    hasCookie: false,
    hasTwoFactorKey: false,
  });

  //Http Response
  const [addAccountResponse, setAddAccountResponse] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingAccountGroup, setIsAddingAccountGroup] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  //Pagination
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Modal
  const [modal, setModal] = useState([]);

  //Use Effects
  useEffect(() => {
    getAccountGroupsData();
  }, [pageNo, pageSize]);

  useEffect(() => {
    getLookupsData();
  }, []);

  //Fetch Data From Api
  async function getAccountGroupsData() {
    setIsLoading(true);
    try {
      let response = await getAllAccountGroups({
        pageNo,
        pageSize,
      });
      var responseMessage = response.message;
      var responseData = !response.data ? [] : response.data;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }
      setAccountGroups(responseData?.items ?? []);
      setCount(responseData.count);
    } catch (error) {
      console.log(error);
      errorToast("Failed to load account groups. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function getLookupsData() {
    let responseData = [];
    try {
      let response = await getAllLookups();
      responseData = response?.data ?? [];
      setCategories(responseData.categories);
      responseData.categories = [];
      setLookups(responseData);
      if (!response.isSuccess) {
        errorToast(response.message);
      }
    } catch {
      setLookups(responseData);
    }
  }

  //Account Group
  const handleAddAccountGroup = async (data) => {
    setIsAddingAccountGroup(true);
    try {
      const response = await addNewAccountGroup(data);
      const responseMessage = response.message;
      if (response.isSuccess) {
        successTaost(responseMessage);
        getAccountGroupsData((previous) => [response.data, ...previous]);
        closeModal(modalKeys.upsertAccountGroup);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to add account group. Please try again.");
    } finally {
      setIsAddingAccountGroup(false);
    }
  };

  //Account
  const handleAddAccount = async (data) => {
    setIsAddingAccount(true);
    const payload = {
      accountGroupId: accountGroupConfig.accountGroupId,
      accounts: data,
    };
    try {
      const response = await addNewAccount(payload);
      const responseMessage = response.message;
      if (response.isSuccess && response.data) {
        setAccountGroups((prev) =>
          prev.map((group) =>
            group.id === accountGroupConfig.accountGroupId
              ? {
                  ...group,
                  totalAvailable:
                    group.totalAvailable + response.data.addedCount,
                }
              : group,
          ),
        );
        setModal((prev) => [...prev, modalKeys.resultModal]);
        setAddAccountResponse(response.data);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to add account. Please try again.");
    } finally {
      setIsAddingAccount(false);
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

  //Select Change
  const handlePlatformChange = (platformId) => {
    const platformCategories = categories.filter(
      (category) => category.platformId == platformId,
    );

    const patformConfiguration =
      lookups.platforms.find((plat) => plat.id == platformId)?.configuration ??
      "";
    setLookups((previous) => ({
      ...previous,
      categories: platformCategories,
      platformConfiguration: patformConfiguration,
    }));
  };

  //Modal
  const OpenModal = (key, accountGroupId) => {
    if (key === modalKeys.upsertAccountGroup || key === modalKeys.newAccount) {
      let selectedAccountGroup = accountGroups.find(
        (accountGroup) => accountGroup.id === accountGroupId,
      );

      let config = {
        accountGroupId: accountGroupId,
        platformId: selectedAccountGroup?.platformId,
        categoryId: selectedAccountGroup?.categoryId,
        unitPrice: selectedAccountGroup?.unitPrice,
        descripion: selectedAccountGroup?.description,
        hasTwoFactorKey: selectedAccountGroup?.hasTwoFactorKey,
        hasCookie: selectedAccountGroup?.hasCookie,
      };

      const platformCategories = categories.filter(
        (category) => category.id == selectedAccountGroup?.categoryId,
      );

      const patformConfiguration =
        lookups.platforms.find(
          (plat) => plat.id == selectedAccountGroup?.categoryId,
        )?.configuration ?? "";

      setLookups((previous) => ({
        ...previous,
        categories: platformCategories,
        platformConfiguration: patformConfiguration,
      }));

      setAccountGroupConfig(config);
    }

    setModal([key]);
  };

  const closeModal = (key) => {
    if (key === modalKeys.newAccountGroup) {
      setLookups((previous) => ({
        ...previous,
        platformConfiguration: "",
      }));
    }
    setModal((prev) => prev.filter((k) => k !== key));
  };

  return (
    <div className="ph-page">
      <div className="ph-filter-actions">
        <button
          className="ph-apply-btn"
          onClick={() => OpenModal(modalKeys.upsertAccountGroup)}
        >
          ✦ Add new
        </button>
      </div>

      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Account Groups</span>
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
                    <th>Platform</th>
                    <th>Category</th>
                    <th>Total Available</th>
                    <th>Purchase Price</th>
                    <th>Sale Price</th>
                    <th>Has Two Factor Key</th>
                    <th>Is Active</th>
                    <th>Admin</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accountGroups.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="um-user-name">{r.platform}</td>
                      <td className="um-user-name">{r.category}</td>
                      <td className="um-user-name">{r.totalAvailable}</td>
                      <td className="um-user-name">
                        {FormatterHelper.formatCurrency(r.purchasePrice)}
                      </td>
                      <td className="um-user-name">
                        {FormatterHelper.formatCurrency(r.salePrice)}
                      </td>
                      <td className="um-user-name">
                        {r.hasCookie ? "true" : "false"}
                      </td>
                      <td className="um-user-name">
                        {r.hasTwoFactorKey ? "true" : "false"}
                      </td>
                      <td className="um-user-name">
                        {r.isActive ? "true" : "false"}
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
                      <td className="um-td">
                        <ActionDropdown
                          accountGroupId={r.id}
                          onAction={OpenModal}
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
        {!isLoading && accountGroups.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">No records found.</span>
          </div>
        )}

        {/* Paginations */}
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
      {/* Modal */}
      {modal.includes(modalKeys.upsertAccountGroup) && (
        <AccountGroupModal
          onClose={closeModal}
          onConfirm={handleAddAccountGroup}
          onPlatformChange={handlePlatformChange}
          isSubmitting={isAddingAccountGroup}
          accountGroupConfig={accountGroupConfig}
          lookups={lookups}
        />
      )}
      {modal.includes(modalKeys.newAccount) && (
        <AddAccountModal
          accountConfig={accountGroupConfig}
          onClose={closeModal}
          onConfirm={handleAddAccount}
          isSubmitting={isAddingAccount}
        />
      )}

      {/* Result Modal */}
      {modal.includes(modalKeys.resultModal) && (
        <ResultModal result={addAccountResponse} onClose={closeModal} />
      )}
    </div>
  );
}
