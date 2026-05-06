//React
import { useEffect, useState } from "react";

//Services
import {
  getAllAccountGroups,
  upsertAccountGroup,
  toggleAccountGroup,
} from "../../../../../services/AccountGroup/AccountGroup.js";
import { addNewAccount } from "../../../../../services/Account/Account.js";
import { getAllLookups } from "../../../../../services/Lookup/Lookup.js";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Paginations
import Paginations from "../../../../Shared/Pagination";

//Modals
import { UpsertAccountGroupModal } from "../../../../Helper/Modals/AccountGroup/UpsertAccountGroupModal.jsx";
import { AddAccountModal } from "../../../../Helper/Modals/AccountGroup/AddAccountModal.jsx";
import { ResultModal } from "../../../../Helper/Modals/AccountGroup/ResultModal.jsx";
import ToggleStatusModal from "../../../../Helper/ContactUs/Modal/ToggleStatusModal.jsx";

//DropDowns
import { ActionDropdown } from "../../../../Helper/DropDown/ActionDropDown.jsx";

//Helper
import { modalKeys } from "../../../../../data/Static.js";

//Css
import "./AccountGroups.css";

export default function AccountGroups() {
  //Data
  const [accountGroups, setAccountGroups] = useState([]);

  //looks will have platforms & platfrom specific categories
  const [lookups, setLookups] = useState([]);

  //categories returned from the api
  const [categories, setCategories] = useState([]);

  const [accountGroupConfig, setAccountGroupConfig] = useState({
    accountGroupId: 0,
    plaformId: 0,
    categoryId: 0,
    plaformConfig: "",
    purchasePrice: 0,
    salePrice: 0,
    descripion: "",
    hasCookie: false,
    hasTwoFactorKey: false,
    isActive: false,
  });

  //Http Response
  const [addAccountResponse, setAddAccountResponse] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingAccountGroup, setIsAddingAccountGroup] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isTogglingAccountGroup, setIsTogglingAccountGroup] = useState(false);

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

  //Fetch Data From Api+
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

  //Upsert Account Group
  const handleUpsertAccountGroup = async (data) => {
    setIsAddingAccountGroup(true);
    let accountGroupId = accountGroupConfig.accountGroupId;
    let isEdit = accountGroupId > 0;
    try {
      const response = await upsertAccountGroup(data, accountGroupId);
      const responseMessage = response.message;
      if (response.isSuccess) {
        successTaost(responseMessage);
        getAccountGroupsData((previous) => {
          let found = false;

          const updated = previous.map((item) => {
            if (item.id === accountGroupId) {
              found = true;
              return response.data;
            }
            return item;
          });

          return found ? updated : [response.data, ...previous];
        });

        closeModal(
          isEdit ? modalKeys.updateAccountGroup : modalKeys.addAccountGroup,
        );
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast(
        `Failed to ${isEdit ? "update" : "add"} account group. Please try again.`,
      );
    } finally {
      setIsAddingAccountGroup(false);
    }
  };

  //Toggle Account Group
  async function handleToggleAccountGroup() {
    setIsTogglingAccountGroup(true);
    try {
      let response = await toggleAccountGroup(
        accountGroupConfig.accountGroupId,
      );

      if (response.isSuccess) {
        const responseData = response.data;
        setAccountGroups((previous) =>
          previous.map((item) =>
            item.id === accountGroupConfig.accountGroupId
              ? {
                  ...item,
                  isActive: responseData.isActive,
                }
              : item,
          ),
        );

        successTaost(response.message);
        closeModal(modalKeys.toggleAccountGroup);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to perform action");
    } finally {
      setIsTogglingAccountGroup(false);
    }
  }

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

  const setPlaformSpecificCategories = (platformId) => {
    //Get the platform sepecific categories
    const platformCategories = categories.filter(
      (category) => category.platformId == platformId,
    );

    //update lookups and add the platform specific categories
    setLookups((prev) => ({
      ...prev,
      categories: platformCategories,
    }));
  };

  const setPlaformConfig = (platformId) => {
    //get platform configuration
    const platformConfig =
      lookups.platforms.find((plat) => plat.id == platformId)?.configuration ??
      "";

    //update accountGroupConfig and add the platform configuraion
    setAccountGroupConfig((prev) => ({
      ...prev,
      platformConfig: platformConfig,
    }));
  };

  //Select Change
  const handlePlatformChange = (platformId) => {
    setPlaformSpecificCategories(platformId);
    setPlaformConfig(platformId);
  };

  //Modal
  const OpenModal = (key, accountGroupId) => {
    let config = {
      accountGroupId: 0,
      plaformId: 0,
      platformConfig: "",
      categoryId: 0,
      purchasePrice: 0,
      salePrice: 0,
      descripion: "",
      hasCookie: false,
      hasTwoFactorKey: false,
    };

    //When opening action model e.g update account group,toggle status and add accounts we need some data to pass to model to edit and store for later use e.g account group id so it will help when adding accounts in a account group.
    if (
      key === modalKeys.updateAccountGroup ||
      key === modalKeys.newAccount ||
      key === modalKeys.toggleAccountGroup
    ) {
      let selectedAccountGroup = accountGroups.find(
        (accountGroup) => accountGroup.id === accountGroupId,
      );
      if (selectedAccountGroup) {
        config.accountGroupId = accountGroupId;
        config.platformId = selectedAccountGroup.platformId;
        config.categoryId = selectedAccountGroup.categoryId;
        config.purchasePrice = selectedAccountGroup.purchasePrice;
        config.salePrice = selectedAccountGroup.salePrice;
        config.description = selectedAccountGroup.description;
        config.customTitle = selectedAccountGroup.customTitle;
        config.hasCookie = selectedAccountGroup.hasCookie;
        config.hasTwoFactorKey = selectedAccountGroup.hasTwoFactorKey;
        config.showCustomTitle = selectedAccountGroup.showCustomTitle;
        config.isActive = selectedAccountGroup.isActive;

        //get platform configuration so we can display to admin for edit
        const platformConfig =
          lookups.platforms.find(
            (plat) => plat.id == selectedAccountGroup.plaformId,
          )?.configuration ?? "";

        config.platformConfig = platformConfig;

        setPlaformSpecificCategories(config.platformId);
      }
    }
    setAccountGroupConfig(config);

    setModal([key]);
  };

  const closeModal = (key) => {
    setModal((prev) => prev.filter((k) => k !== key));
  };

  return (
    <div className="ph-page">
      <div className="ph-filter-actions">
        <button
          className="ph-apply-btn"
          onClick={() => OpenModal(modalKeys.addAccountGroup)}
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
                    <th>Has Cookie</th>
                    <th>Has Two Factor Key</th>
                    <th>Show Custom Title</th>
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
                        {r.hasCookie ? "True" : "False"}
                      </td>
                      <td className="um-user-name">
                        {r.hasTwoFactorKey ? "True" : "False"}
                      </td>
                      <td className="um-user-name">
                        {r.showCustomTitle ? "True" : "False"}
                      </td>
                      <td className="um-user-name">
                        {r.isActive ? "True" : "False"}
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
                          isActive={r.isActive}
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
      {(modal.includes(modalKeys.addAccountGroup) ||
        modal.includes(modalKeys.updateAccountGroup)) && (
        <UpsertAccountGroupModal
          onClose={closeModal}
          onConfirm={handleUpsertAccountGroup}
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

      {modal.includes(modalKeys.toggleAccountGroup) && (
        <ToggleStatusModal
          isActive={accountGroupConfig.isActive}
          onConfirm={handleToggleAccountGroup}
          onClose={() => closeModal(modalKeys.toggleAccountGroup)}
          isLoading={isTogglingAccountGroup}
          config={{
            activeLabel: "Active",
            inactiveLabel: "Inactive",
            activeIcon: "✅",
            inactiveIcon: "🚫",
            activeClass: "success",
            inactiveClass: "danger",
          }}
        />
      )}

      {/* Result Modal */}
      {modal.includes(modalKeys.resultModal) && (
        <ResultModal result={addAccountResponse ?? []} onClose={closeModal} />
      )}
      {/* modal.includes(modalKeys.resultModal) */}
    </div>
  );
}
