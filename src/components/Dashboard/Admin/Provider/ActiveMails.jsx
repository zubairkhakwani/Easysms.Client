import { useEffect, useState, useContext } from "react";
import { SmsContext } from "../../../../context/SmsContext";
import { MailContext } from "../../../../context/MailContext";
import { getActiveMails } from "../../../../services/TempMail/TempMailService";
import { errorToast } from "../../../../helper/Toaster";
import { FormatterHelper } from "../../../../helper/FormatterHelper";
import { FormatRemainingTime } from "../../../../helper/UtilityHelper";
import "./ActiveNumbers.css";

export default function ActiveMails() {
  const [activeMails, setActiveMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const { latestMail } = useContext(SmsContext);
  const { newMails, removeMailId } = useContext(MailContext);

  async function getActiveMailsData() {
    setIsLoading(true);
    try {
      let response = await getActiveMails();
      var responseMessage = response.message;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }

      setActiveMails(response.data ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getActiveMailsData();
  }, []);

  // Tick server-provided remainingSeconds for display only (admin table).
  useEffect(() => {
    if (!activeMails.length) return;

    const interval = setInterval(() => {
      setActiveMails((prev) =>
        prev.map((order) => ({
          ...order,
          remainingSeconds: Math.max(
            0,
            (order.remainingSeconds ?? order.activationLimit * 60) - 1,
          ),
        })),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMails.length]);

  useEffect(() => {
    if (!searchKeyword) {
      setFilteredMails(activeMails);
      return;
    }

    const keyword = searchKeyword.toLowerCase();

    setFilteredMails(
      activeMails.filter(
        (u) =>
          String(u.activationId ?? "")
            .toLowerCase()
            .includes(keyword) ||
          u.email?.toLowerCase().includes(keyword) ||
          u.domain?.toLowerCase().includes(keyword) ||
          u.service?.toLowerCase().includes(keyword) ||
          u.name?.toLowerCase().includes(keyword) ||
          u.userEmail?.toLowerCase().includes(keyword) ||
          u.code?.toLowerCase().includes(keyword),
      ),
    );
  }, [activeMails, searchKeyword]);

  useEffect(() => {
    if (!latestMail) {
      return;
    }

    setActiveMails((current) =>
      current.map((mail) => {
        if (mail.id === latestMail.id) {
          return { ...mail, code: latestMail.code };
        }
        return mail;
      }),
    );
  }, [latestMail]);

  useEffect(() => {
    if (!newMails) {
      return;
    }
    setActiveMails((current) => [...newMails, ...current]);
  }, [newMails]);

  useEffect(() => {
    if (!removeMailId) {
      return;
    }
    setRemovingId(removeMailId);

    const timer = setTimeout(() => {
      setActiveMails((current) =>
        current.filter((mail) => mail.id !== removeMailId),
      );
      setRemovingId(null);
    }, 600);

    return () => clearTimeout(timer);
  }, [removeMailId]);

  return (
    <div className="ph-page">
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Active Mails</span>
        </div>
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <div className="um-table-header">
                <span className="um-table-title">All Active Mails</span>
                <input
                  className="um-search-input"
                  placeholder="🔍  Search mails..."
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Activation Id</th>
                    <th>Mail</th>
                    <th>Service</th>
                    <th>Domain</th>
                    <th>Otp</th>
                    <th>Remaining Time</th>
                    <th>Name</th>
                    <th>User Email</th>
                    <th>Purchased At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMails.map((r, index) => (
                    <tr
                      key={r.id}
                      className={removingId === r.id ? "row-removing" : ""}
                    >
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.activationId}</td>
                      <td className="ph-col-phone">{r.email}</td>
                      <td className="ph-col-id">{r.service}</td>
                      <td className="ph-col-id">{r.domain}</td>
                      <td className="ph-col-sms" title={r.code}>
                        {r.code || "-"}
                      </td>
                      <td className="ph-col-sms">
                        {FormatRemainingTime(r.remainingSeconds)}
                      </td>
                      <td className="ph-col-id">{r.name}</td>
                      <td className="ph-col-id">{r.userEmail}</td>
                      <td className="ph-col-sms" title={r.purchasedAt}>
                        {FormatterHelper.formatDateToLocal(r.purchasedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {!isLoading && activeMails.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
