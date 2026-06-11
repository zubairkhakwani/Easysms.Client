<div class="grid">
    <div class="card">
        <div class="card-header">
            {/*<span class="card-icon">1</span>*/}
            <div>
                <div class="card-title">Getting Started</div>
                <div class="card-sub">Follow these steps to receive your verification code</div>
            </div>
        </div>

        <div class="guide-steps">
            <div class="guide-step">
                <div class="step-num">1</div>
                <div><div class="step-title">Select Your Options</div><div class="step-desc">Choose your SMS provider, service, country, and operator from the form on the right.</div></div>
            </div>
            <div class="guide-step">
                <div class="step-num">2</div>
                <div><div class="step-title">Check Price &amp; Availability</div><div class="step-desc">Review the service information to see the price and available numbers.</div></div>
            </div>
            <div class="guide-step">
                <div class="step-num">3</div>
                <div><div class="step-title">Click "Get Number"</div><div class="step-desc">Press the button to receive your temporary phone number instantly.</div></div>
            </div>
            <div class="guide-step">
                <div class="step-num">4</div>
                <div><div class="step-title">Use the Number</div><div class="step-desc">Enter the provided number in your app or service to receive the SMS code.</div></div>
            </div>
            <div class="guide-step">
                <div class="step-num">5</div>
                <div><div class="step-title">Get Your Code</div><div class="step-desc">Your verification code will appear on this page within a few minutes.</div></div>
            </div>
        </div>

        <div class="notes-box">
            <div class="notes-title">⚠️ Important Notes</div>
            <div class="note-item"><span class="note-dot">•</span><span>Numbers are temporary and expire after 15–20 minutes</span></div>
            <div class="note-item"><span class="note-dot">•</span><span>Make sure you have sufficient balance before ordering</span></div>
            <div class="note-item"><span class="note-dot">•</span><span>Use the number immediately after receiving it</span></div>
            <div class="note-item"><span class="note-dot">•</span><span>Some services may take longer to deliver SMS codes</span></div>
        </div>
    </div>


    <div class="card">
        <div class="card-header">
            <span class="card-icon">📱</span>
            <div>
                <div class="card-title">Get Phone Number</div>
                <div class="card-sub">Configure your options below</div>
            </div>
        </div>

        <div class="fields">
            <div class="field">
                <label>🏢 SMS Provider</label>
                <select id="provider">
                    <option value="">Select provider...</option>
                    <option>5SIM</option>
                    <option>SMS-Activate</option>
                    <option>GetSMS</option>
                    <option>VirtualSMS</option>
                </select>
            </div>
            <div class="field">
                <label>📲 Service</label>
                <select id="service">
                    <option value="">Select service...</option>
                    <option>WhatsApp</option>
                    <option>Telegram</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Gmail</option>
                    <option>Discord</option>
                    <option>TikTok</option>
                    <option>Uber</option>
                </select>
            </div>
            <div class="field">
                <label>🌍 Country</label>
                <select id="country" >
                    <option value="">Select country...</option>
                    <option>United States 🇺🇸</option>
                    <option>United Kingdom 🇬🇧</option>
                    <option>India 🇮🇳</option>
                    <option>Germany 🇩🇪</option>
                    <option>France 🇫🇷</option>
                    <option>Brazil 🇧🇷</option>
                    <option>Canada 🇨🇦</option>
                </select>
            </div>
            <div class="field">
                <label>📡 Operator / Pricing</label>
                <select id="operator" disabled >
                    <option value="">Select country first</option>
                </select>
            </div>
        </div>

        <div class="price-preview" id="pricePreview" style="display:none">
            <span class="price-label">Estimated Cost</span>
            <span class="price-value" id="priceVal">$0.00</span>
        </div>

        <button class="get-btn" id="getBtn" disabled >⚡ Get Number</button>

        <div id="resultBox" style="display:none" class="result-box">
            <div class="result-eyebrow">Your number is ready</div>
            <div class="result-number" id="resultNum"></div>
            <div class="result-meta" id="resultMeta"></div>
            <button class="copy-btn" >📋 Copy Number</button>
        </div>
    </div>


    <div class="card">
        <div class="card-header">
            <div class="orders-top" style="width:100%">
                <div style="display:flex;gap:14px;align-items:flex-start">
                    <span class="card-icon">🕐</span>
                    <div>
                        <div class="card-title">Recent Orders</div>
                        <div class="card-sub" id="ordersSub">Your orders will appear here</div>
                    </div>
                </div>
                <span class="orders-badge" id="ordersBadge" style="display:none">0</span>
            </div>
        </div>

        <div id="emptyState" class="empty-state">
            <div class="empty-icon">📭</div>
            <div class="empty-text">No orders yet</div>
            <div class="empty-hint">Numbers you purchase will show up here instantly — no need to navigate away.</div>
        </div>

        <div id="ordersList" class="orders-list" style="display:none"></div>
    </div>

</div>