import { spawn } from "node:child_process";

const siteUrl = (process.env.SITE_URL ?? "http://localhost:3101").replace(/\/$/, "");
const debugPort = Number(process.env.E2E_DEBUG_PORT ?? 9340);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForJson(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      lastError = error;
    }
    await delay(150);
  }
  throw lastError ?? new Error(`Unable to reach ${url}`);
}

function createCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();
  const events = [];

  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const resolver = pending.get(message.id);
      if (!resolver) return;
      pending.delete(message.id);
      if (message.error) resolver.reject(new Error(message.error.message));
      else resolver.resolve(message.result);
      return;
    }
    events.push(message);
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = ++sequence;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    async waitFor(method, timeoutMs = 10_000) {
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        const index = events.findIndex(event => event.method === method);
        if (index >= 0) return events.splice(index, 1)[0];
        await delay(25);
      }
      throw new Error(`Timed out waiting for ${method}`);
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await cdp.waitFor("Page.loadEventFired");
  await delay(350);
}

const chrome = spawn("chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=/tmp/fauzi-form-e2e-${debugPort}`,
  "about:blank",
], { stdio: "ignore" });

try {
  const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const page = targets.find(target => target.type === "page");
  if (!page?.webSocketDebuggerUrl) throw new Error("No browser page target available");

  const cdp = createCdp(page.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  await navigate(cdp, `${siteUrl}/`);
  const formResult = await evaluate(cdp, `(async () => {
    const records = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      const response = await originalFetch(...args);
      let body = null;
      try { body = await response.clone().json(); } catch { /* ignored */ }
      records.push({ url: String(args[0]), status: response.status, body });
      return response;
    };
    const setInput = (element, value) => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      descriptor?.set?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const setTextArea = (element, value) => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
      descriptor?.set?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const subscribe = document.querySelector('form[aria-label="Berlangganan catatan jurnal"]');
    const subscribeEmail = subscribe?.querySelector('input[type="email"]');
    const consent = subscribe?.querySelector('input[type="checkbox"]');
    if (!subscribe || !subscribeEmail || !consent) throw new Error('Form subscriber tidak ditemukan');
    setInput(subscribeEmail, 'dry-run-subscriber@example.com');
    consent.click();
    subscribe.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 450));

    const inquiry = document.querySelector('form[aria-label="Formulir pertanyaan media"]');
    const inputs = inquiry?.querySelectorAll('input');
    const message = inquiry?.querySelector('textarea');
    if (!inquiry || !inputs?.[0] || !inputs?.[1] || !message) throw new Error('Form pertanyaan media tidak ditemukan');
    setInput(inputs[0], 'Dry Run Editor');
    setInput(inputs[1], 'dry-run-editor@example.com');
    setTextArea(message, 'This dry-run request is verified without persistence.');
    inquiry.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 450));

    globalThis.fetch = originalFetch;
    return {
      records,
      subscribeSuccess: document.body.textContent?.includes('Anda sudah terdaftar.') ?? false,
      inquirySuccess: document.body.textContent?.includes('Pesan Anda sudah masuk ke inbox.') ?? false,
    };
  })()`);

  await navigate(cdp, `${siteUrl}/unsubscribe?token=${"a".repeat(24)}`);
  const unsubscribeResult = await evaluate(cdp, `(async () => {
    const records = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      const response = await originalFetch(...args);
      let body = null;
      try { body = await response.clone().json(); } catch { /* ignored */ }
      records.push({ url: String(args[0]), status: response.status, body });
      return response;
    };
    document.querySelector('button')?.click();
    await new Promise(resolve => setTimeout(resolve, 450));
    globalThis.fetch = originalFetch;
    return {
      records,
      success: document.body.textContent?.includes('Anda sudah berhenti berlangganan.') ?? false,
    };
  })()`);

  const allRecords = [...formResult.records, ...unsubscribeResult.records];
  const paths = allRecords.map(record => record.url);
  const allDryRuns = allRecords.every(record => record.status === 200 && record.body?.[0]?.result?.data?.json?.dryRun === true);
  const passed = formResult.subscribeSuccess
    && formResult.inquirySuccess
    && unsubscribeResult.success
    && paths.some(path => path.includes("editorial.subscribe"))
    && paths.some(path => path.includes("editorial.submitInquiry"))
    && paths.some(path => path.includes("editorial.unsubscribe"))
    && allDryRuns;

  console.log(JSON.stringify({ passed, formResult, unsubscribeResult }, null, 2));
  if (!passed) process.exitCode = 1;
  cdp.close();
} finally {
  chrome.kill("SIGTERM");
}
