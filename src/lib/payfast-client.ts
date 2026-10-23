/**
 * Browser side of the PayFast handoff: asks /initiate for the signed form and
 * POSTs the browser straight to PayFast (mock mode returns a plain redirect).
 * Returns an error message, or never resolves because the page is leaving.
 */
interface InitiateResponse {
  mode: "mock" | "sandbox" | "live";
  redirectTo?: string;
  action?: string;
  fields?: Record<string, string>;
  error?: string;
}

export async function goToPayfast(orderId: string): Promise<string> {
  let data: InitiateResponse;
  try {
    const response = await fetch("/api/payments/payfast/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    data = (await response.json()) as InitiateResponse;
    if (!response.ok) return data.error ?? "We could not reach PayFast. Please try again.";
  } catch {
    return "We could not reach PayFast. Check your connection and try again.";
  }

  if (data.redirectTo) {
    window.location.href = data.redirectTo;
    return new Promise(() => {});
  }
  if (!data.action || !data.fields) return "PayFast did not return a payment form.";

  // PayFast wants a form POST, so build one and submit it.
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.action;
  form.style.display = "none";
  for (const [name, value] of Object.entries(data.fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  return new Promise(() => {});
}
