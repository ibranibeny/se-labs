// Convert ```mermaid fenced code blocks (rendered by Rouge as .language-mermaid)
// into live Mermaid diagrams. Works with the Minimal Mistakes theme.
(function () {
  function toDiagrams() {
    var blocks = document.querySelectorAll(".language-mermaid");
    blocks.forEach(function (el) {
      var pre = document.createElement("pre");
      pre.className = "mermaid";
      pre.textContent = (el.textContent || "").replace(/\n$/, "");
      el.replaceWith(pre);
    });
  }

  function run() {
    if (typeof mermaid === "undefined") {
      return window.setTimeout(run, 50);
    }
    toDiagrams();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default"
    });
    try {
      mermaid.run();
    } catch (e) {
      mermaid.init(undefined, document.querySelectorAll(".mermaid"));
    }
  }

  if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
