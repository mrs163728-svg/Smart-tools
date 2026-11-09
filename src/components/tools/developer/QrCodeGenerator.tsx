import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode, RefreshCw } from 'lucide-react';

export const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  const [textValue, setTextValue] = useState('https://smarttoolsworld.com');
  const [wifiSsid, setWifiSsid] = useState('HomeNetwork');
  const [wifiPassword, setWifiPassword] = useState('secret123');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [emailTo, setEmailTo] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const getPayload = (): string => {
    if (qrType === 'url' || qrType === 'text') {
      return textValue;
    }
    if (qrType === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
    }
    if (qrType === 'email') {
      return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
    }
    return textValue;
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload.trim()) return;

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [qrType, textValue, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
        <button
          onClick={() => { setQrType('url'); setTextValue('https://'); }}
          className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            qrType === 'url' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Website URL
        </button>
        <button
          onClick={() => { setQrType('text'); setTextValue('Hello World'); }}
          className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            qrType === 'text' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Plain Text
        </button>
        <button
          onClick={() => setQrType('wifi')}
          className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            qrType === 'wifi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          WiFi Network
        </button>
        <button
          onClick={() => setQrType('email')}
          className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            qrType === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Parameters */}
        <div className="space-y-5">
          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Website Address (URL)
              </label>
              <input
                type="url"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Plain Text Content
              </label>
              <textarea
                rows={4}
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                placeholder="Enter any text message..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Network SSID (Name)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={e => setWifiSsid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  WiFi Password
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={e => setWifiPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Security Encryption
                </label>
                <select
                  value={wifiEncryption}
                  onChange={e => setWifiEncryption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          )}

          {qrType === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Color pickers */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-semibold">QR Color:</span>
              <input
                type="color"
                value={fgColor}
                onChange={e => setFgColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-semibold">Background:</span>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* QR Code Display & Download */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-5 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR code" className="w-56 h-56" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full justify-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Content'}
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
