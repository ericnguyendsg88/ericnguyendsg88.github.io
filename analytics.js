// Visit analytics for the portfolio, sent to PostHog (US cloud).
// Every event carries site = "portfolio" so it can be filtered apart from SnipCam's app events.
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags on onFeatureFlags onSessionId identify setPersonProperties group resetGroups reset get_distinct_id get_session_id alias set_config startSessionRecording stopSessionRecording captureException get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

(function () {
  // Skip local previews so testing on this Mac doesn't count as a visit.
  var host = location.hostname;
  if (host !== "ericnguyendsg88.github.io" && !/[?&]analytics=test\b/.test(location.search)) return;

  posthog.init("phc_wq2qZ8YMt24DhkfbBrSBMiaJSYX29E5SfvphjAq6dkmb", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
    persistence: "localStorage",
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true
  });

  // Tag the visit with ?ref= (or utm_source) from links like ericnguyendsg88.github.io/?ref=grab.
  // register() keeps it for the rest of the visit, across pages.
  var params = new URLSearchParams(location.search);
  var ref = params.get("ref") || params.get("utm_source");
  posthog.register({ site: "portfolio" });
  if (ref) {
    posthog.register({ ref: ref });
    posthog.register_once({ first_ref: ref });
  }

  // Name the clicks that matter.
  function kind(href) {
    if (/\.pdf($|\?)/i.test(href)) return "resume_download";
    if (/testflight\.apple\.com/.test(href)) return "testflight_click";
    if (/github\.com\/.+\/releases\//.test(href)) return "app_download";
    if (/^mailto:/.test(href)) return "email_click";
    if (/linkedin\.com/.test(href)) return "linkedin_click";
    if (/github\.com/.test(href)) return "github_click";
    return null;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var name = kind(a.href);
    if (name) posthog.capture(name, { href: a.href, label: (a.textContent || "").trim().slice(0, 80), page: location.pathname }, { transport: "sendBeacon" });
  }, true);
})();
