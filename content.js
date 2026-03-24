(function () {
  const TOAST_ID = "__mailto_copy_hijacker_toast__";

  function extractEmail(rawHref) {
    if (!rawHref || !rawHref.toLowerCase().startsWith("mailto:")) {
      return null;
    }

    const withoutScheme = rawHref.slice(7);
    const queryIndex = withoutScheme.indexOf("?");
    const addressPart =
      queryIndex >= 0 ? withoutScheme.slice(0, queryIndex) : withoutScheme;
    const decoded = decodeURIComponent(addressPart).trim();
    return decoded || null;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.documentElement.appendChild(textarea);
      textarea.select();

      try {
        return document.execCommand("copy");
      } finally {
        textarea.remove();
      }
    }
  }

  function showToast(message, isError) {
    const doc = document;
    if (!doc || !doc.body) {
      window.setTimeout(() => showToast(message, isError), 50);
      return;
    }

    let toast = doc.getElementById(TOAST_ID);
    if (!toast) {
      toast = doc.createElement("div");
      toast.id = TOAST_ID;
      toast.style.position = "fixed";
      toast.style.right = "16px";
      toast.style.bottom = "16px";
      toast.style.zIndex = "2147483647";
      toast.style.maxWidth = "320px";
      toast.style.padding = "12px 14px";
      toast.style.borderRadius = "10px";
      toast.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
      toast.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
      toast.style.fontSize = "14px";
      toast.style.lineHeight = "1.4";
      toast.style.color = "#ffffff";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";
      toast.style.transition = "opacity 140ms ease, transform 140ms ease";
      toast.style.pointerEvents = "none";
      doc.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = isError ? "#b42318" : "#111827";
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    window.clearTimeout(showToast.dismissTimer);
    showToast.dismissTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";
    }, 1800);
  }

  async function handleMailtoLink(link, event) {
    const href = link.getAttribute("href") || link.href;
    const email = extractEmail(href);
    if (!email) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const copied = await copyText(email);
    if (copied) {
      showToast(`Copied email: ${email}`, false);
    } else {
      showToast("Could not copy email address", true);
    }
  }

  function getMailtoAnchor(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest('a[href^="mailto:" i]');
  }

  function onPointerActivation(event) {
    const link = getMailtoAnchor(event.target);
    if (!link) {
      return;
    }

    void handleMailtoLink(link, event);
  }

  function onKeyboardActivation(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const link = getMailtoAnchor(event.target);
    if (!link) {
      return;
    }

    void handleMailtoLink(link, event);
  }

  document.addEventListener("click", onPointerActivation, true);
  document.addEventListener("auxclick", onPointerActivation, true);
  document.addEventListener("keydown", onKeyboardActivation, true);
})();
