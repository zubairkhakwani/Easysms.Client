import { useContext, useMemo, useState } from "react";

import { AuthContext } from "../../context/AuthContext";

import { successTaost, errorToast } from "../../helper/Toaster";

import Header from "../Helper/Header/Header";

import "../LandingPage/LandingShared.css";
import "./EarnWithUs.css";

const INSIGHTS = [
  {
    icon: "fa-solid fa-percent",

    title: "Earn on every order",

    text: "You get a cut each time your referrals buy temp numbers, proxies, mail rental, or accounts.",

    accent: "cyan",
  },

  {
    icon: "fa-solid fa-infinity",

    title: "No referral limit",

    text: "Invite as many people as you want — there is no cap on how much you can earn.",

    accent: "green",
  },

  {
    icon: "fa-solid fa-bolt",

    title: "Zero extra setup",

    text: "They sign up through your link like normal. You do not need to manage codes or track anyone manually.",

    accent: "blue",
  },

  {
    icon: "fa-solid fa-wallet",

    title: "Rewards add up",

    text: "Active users who order regularly mean recurring earnings for you over time.",

    accent: "orange",
  },
];

const SHARE_IDEAS = [
  { icon: "fa-brands fa-telegram", label: "Telegram groups & channels" },

  { icon: "fa-brands fa-discord", label: "Discord communities" },

  { icon: "fa-brands fa-x-twitter", label: "Social posts & threads" },

  { icon: "fa-solid fa-users", label: "Friends, teams & clients" },
];

export default function EarnWithUs() {
  const { currentUser } = useContext(AuthContext);

  const [copied, setCopied] = useState(false);

  const referralLink = useMemo(() => {
    if (!currentUser?.referralCode) return "";

    const params = new URLSearchParams({
      referral: currentUser.referralCode,
    });

    return `${window.location.origin}/?${params.toString()}`;
  }, [currentUser?.referralCode]);

  async function handleCopy() {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      successTaost("Referral link copied!");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      errorToast("Failed to copy link. Please copy manually.");
    }
  }

  return (
    <div className="earn-page">
      <Header
        title="Earn With Us"
        description="Share your link and earn a percentage whenever your referrals place an order."
      />

      <div className="earn-content">
        <section className="earn-spotlight">
          <div className="earn-spotlight-glow" aria-hidden="true" />

          <div className="earn-spotlight-inner">
            <span className="earn-spotlight-badge">
              <i className="fa-solid fa-gift" />
              Referral program
            </span>

            <h2 className="earn-spotlight-headline">
              Share your link.
              <span> Earn on every order they place.</span>
            </h2>

            <p className="earn-spotlight-sub">
              Copy the link below and send it anywhere — when someone signs up
              and uses EasyOtps, you earn a share of what they spend.
            </p>

            {!currentUser?.referralCode ? (
              <div className="earn-spotlight-loading">
                <div className="ph-spinner ph-spinner--sm" />

                <span>Preparing your referral link…</span>
              </div>
            ) : (
              <div className="earn-spotlight-link-block">
                <label
                  className="earn-spotlight-link-label"
                  htmlFor="referral-link"
                >
                  Your link to share
                </label>
                <div className="earn-spotlight-link-row">
                  <input
                    id="referral-link"
                    className="earn-spotlight-link-field"
                    type="text"
                    readOnly
                    value={referralLink}
                    aria-label="Referral link"
                  />
                  <button
                    type="button"
                    className="earn-spotlight-copy-btn"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <i className="fa-solid fa-check" /> Copied
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-copy" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="earn-insights">
          {INSIGHTS.map((item) => (
            <article
              key={item.title}
              className={`earn-insight card-surface earn-insight--${item.accent}`}
            >
              <div className="earn-insight-icon">
                <i className={item.icon} />
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="earn-how card-surface">
          <div className="earn-how-header">
            <h3>How it works</h3>

            <p>Three steps. That is all there is to it.</p>
          </div>

          <div className="earn-how-steps">
            <div className="earn-how-step">
              <span className="earn-how-num">1</span>

              <div>
                <h4>Copy your link</h4>

                <p>Use the link above — it is unique to your account.</p>
              </div>
            </div>

            <div className="earn-how-connector" aria-hidden="true" />

            <div className="earn-how-step">
              <span className="earn-how-num">2</span>

              <div>
                <h4>They join EasyOtps</h4>

                <p>
                  New users register through your link. No extra steps for them.
                </p>
              </div>
            </div>

            <div className="earn-how-connector" aria-hidden="true" />

            <div className="earn-how-step">
              <span className="earn-how-num">3</span>

              <div>
                <h4>You earn</h4>

                <p>
                  Every order they place puts a percentage back in your pocket.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="earn-share card-surface">
          <div className="earn-share-header">
            <i className="fa-solid fa-bullhorn" />

            <div>
              <h3>Where to share</h3>

              <p>The more eyes on your link, the more you can earn.</p>
            </div>
          </div>

          <ul className="earn-share-list">
            {SHARE_IDEAS.map((item) => (
              <li key={item.label}>
                <i className={item.icon} />

                {item.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
