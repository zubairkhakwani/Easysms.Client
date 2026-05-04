//React
import { useState, useEffect, useContext } from "react";

//Services
import { getAllPlatforms } from "../../services/Platform/PlatformService";
import { getAllCategories } from "../../services/Category/CategoryService";
import { getAllAccounts, buyNewAccount } from "../../services/Account/Account";

//Context
import { AuthContext } from "../../context/AuthContext";

//Toaster
import { errorToast, successTaost } from "../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";
import { DownloadPurchaseReceipt } from "../../helper/DownloadPurchaseReceipt";

//Css
import "./RequestAccount.css";

// Icons as React components
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 
    8 10z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default function RequestAccount() {
  const { balanceDebit } = useContext(AuthContext);
  //Data
  const [accounts, setAccounts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  //Filter
  const [patformCategories, setPlaformCategories] = useState([]);
  const [platform, setPlatform] = useState("0");
  const [category, setCategory] = useState("0");

  const [viewMode, setViewMode] = useState("grid");

  const [searchQuery, setSearchQuery] = useState("");

  const [quantities, setQuantities] = useState({});
  const [buyingState, setBuyingState] = useState({});

  const handleQuantityChange = (id, val) => {
    let account = accounts
      .flatMap((acc) => acc.groups)
      .find((group) => group.accountGroupId === id);
    if (val > account.totalAvailable) {
      //  /errorToast("Please enter valid quantity");
      setQuantities((prev) => ({ ...prev, [id]: 1 }));
    } else {
      setQuantities((prev) => ({ ...prev, [id]: val }));
    }
  };

  //Use Effects
  useEffect(() => {
    getPlatformData();
  }, []);

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    getAccountsData();
  }, [platform, category]);

  //Fetch Data From Api
  async function getPlatformData() {
    let responseMessage = "";
    let responseData = [];

    try {
      let response = await getAllPlatforms({ pageNo: 0, pageSize: 1000 });
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

  async function getCategoryData() {
    let responseMessage = "";
    let responseData = [];

    try {
      let response = await getAllCategories({
        pageNo: 0,
        pageSize: 1000,
        platformId: 0,
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
      setCategories(responseData);
    }
  }

  async function getAccountsData() {
    let responseData = [];
    try {
      let response = await getAllAccounts({
        platformId: platform,
        categoryId: category,
      });

      if (!response.isSuccess) {
        errorToast(response.message);
      } else {
        responseData = response.data ?? [];
      }
    } catch {
      errorToast("Unable to load accounts. Please try again.");
    } finally {
      setAccounts(responseData);
    }
  }

  //Buy Accounts
  async function handleBuyAccounts(request) {
    let responseMessage = "";

    let accountGroupId = request.accountGroupId;
    setBuyingState((prev) => ({ ...prev, [accountGroupId]: true }));

    try {
      let response = await buyNewAccount(request);
      responseMessage = response.message;

      if (response.isSuccess) {
        successTaost(responseMessage);
        balanceDebit(response.data?.totalCost ?? 0);

        const decrement = response.data.accounts.length;

        setAccounts((prev) =>
          prev.map((platform) => ({
            ...platform,
            groups: platform.groups.map((group) =>
              group.accountGroupId === accountGroupId
                ? {
                    ...group,
                    totalAvailable: Math.max(
                      0,
                      group.totalAvailable - decrement,
                    ),
                  }
                : group,
            ),
          })),
        );

        DownloadPurchaseReceipt(response.data ?? [], true);
      } else {
        errorToast(responseMessage);
      }
    } catch (err) {
      console.log(err);
      errorToast("Failed to buy account, please try later.");
    } finally {
      setBuyingState((prev) => ({
        ...prev,
        [request.accountGroupId]: false,
      }));
    }
  }

  //Filters
  function handlePlatformChange(platformId) {
    setPlatform(platformId);
    const platformCategories = categories.filter(
      (category) => category.platformId == platformId,
    );
    setPlaformCategories(platformCategories);
  }

  function handleCategoryChange(categoryId) {
    setCategory(categoryId);
  }

  function buildGroupText(length) {
    return `${length} Group ${length > 1 ? "s" : ""}`;
  }

  return (
    <div className="marketplace-container">
      {/* Header */}
      <header className="marketplace-header">
        <div className="header-left">
          <div className="header-icon">
            <ShieldIcon />
          </div>
          <div className="header-title">
            <h1>Account Marketplace</h1>
            <p>Browse and purchase verified accounts</p>
          </div>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fa-solid fa-border-all"></i>
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <i className="fa-solid fa-list"></i>
            </button>
          </div>
          <div className="group-count">{buildGroupText(accounts.length)}</div>
        </div>
      </header>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-row">
          <div className="filter-dropdown">
            <select
              value={platform}
              onChange={(e) => handlePlatformChange(e.target.value)}
            >
              <option value="0">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-dropdown">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="0">All Categories</option>
              {patformCategories.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="search-input">
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
        </div>
      </section>

      {/* Account Listings */}
      {accounts.map((accountGroup) => (
        <div key={accountGroup.platformName} className="platform-section">
          <div className="platform-header">
            <h2 className="platform-title">{accountGroup.platformName}</h2>
            <span className="group-count">
              {buildGroupText(accountGroup.totalGroups)}
            </span>
          </div>
          <div
            className={`accounts-grid ${viewMode === "list" ? "list-view" : ""}`}
          >
            {accountGroup.groups.map((account) => (
              <AccountCard
                key={account.accountGroupId}
                account={account}
                quantity={quantities[account.accountGroupId] ?? 1}
                onQuantityChange={(val) =>
                  handleQuantityChange(account.accountGroupId, val)
                }
                OnBuy={handleBuyAccounts}
                isBuying={buyingState[account.accountGroupId] ?? false}
              />
            ))}
          </div>
        </div>
      ))}
      {accounts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h3 className="empty-state-title">No accounts found</h3>
          <p className="empty-state-text">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
}

//AccountCard
function AccountCard({ account, quantity, onQuantityChange, OnBuy, isBuying }) {
  const outOfStock = account.totalAvailable === 0;
  const DEFAULT_PLATFORM_LOGO = "public/default_platform_logo.png";
  const statusClass = {
    Complete: "complete",
    "Partially Complete": "partial",
    "In Complete": "incomplete",
  };

  return (
    <div className={`account-card ${outOfStock ? "out-of-stock" : ""}`}>
      {/* Header */}
      <div className="account-card-header">
        <div className="card-title">
          <div className="card-platform-row">
            <img
              className="platform-logo"
              src={`${account.platformLogoUrl}`}
              alt={`${DEFAULT_PLATFORM_LOGO}`}
              onError={(e) => {
                e.target.src = `${DEFAULT_PLATFORM_LOGO}`;
              }}
            />

            <span className="card-platform">{account.platformName}</span>
          </div>
          <span className="card-type">· {account.categoryName}</span>
        </div>
        <div
          className={`stock-badge ${outOfStock ? "out-of-stock" : "in-stock"}`}
        >
          {outOfStock ? <XCircleIcon /> : <CheckCircleIcon />}
          {outOfStock ? "Out of Stock" : "In Stock"}
        </div>
      </div>

      {/* Description */}
      <p className="card-description">{account.description}</p>

      {/* Meta */}
      {/* <div className="card-meta">
        <span className="meta-item">
          <i className="fa-solid fa-location-dot"></i>
          {account.registrationCountry}
        </span>
        <span className="meta-item">
          <i className="fa-solid fa-user"></i>
          {account.gender}
        </span>
        <span
          className={`meta-status ${statusClass[account.completionStatus] ?? ""}`}
        >
          {account.completionStatus}
        </span>
      </div> */}

      {/* Feature Tags */}
      {account.features && (
        <div className="feature-tags">
          {Object.entries(account.features).map(([key, value]) => (
            <span
              key={key}
              className={`feature-tag ${value ? "active" : "inactive"}`}
            >
              {key}
            </span>
          ))}
        </div>
      )}

      {/* Pricing */}
      <div className="pricing-section">
        <div className="pricing-row">
          <div className="pricing-item">
            <span
              className={`pricing-value ${outOfStock ? "zero" : "available"}`}
            >
              {account.totalAvailable}
            </span>
            <span className="pricing-label">Available</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-value price">
              ${account.unitPrice.toFixed(2)}
            </span>
            <span className="pricing-label">Unit Price</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-value total">
              {FormatterHelper.formatCurrency(quantity * account.unitPrice)}
            </span>
            <span className="pricing-label">Total</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <div className="quantity-selector">
          <button
            className="qty-btn"
            value={quantity}
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={outOfStock || isBuying || quantity <= 1}
          >
            −
          </button>
          <input
            type="text"
            className="qty-value"
            value={quantity}
            disabled={outOfStock || isBuying}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) onQuantityChange(val);
            }}
          />
          <button
            className="qty-btn"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={
              outOfStock || isBuying || quantity >= account.totalAvailable
            }
          >
            +
          </button>
        </div>
        <button
          className={`buy-btn ${!isBuying ? "primary" : ""}`}
          disabled={outOfStock || isBuying}
          onClick={() =>
            OnBuy({ quantity, accountGroupId: account.accountGroupId })
          }
        >
          {isBuying ? <div className="ph-spinner" /> : <span>Buy</span>}
        </button>
      </div>
    </div>
  );
}
