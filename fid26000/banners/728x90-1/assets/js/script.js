/* global gsap */
(function () {
  if (typeof window.CustomEvent === "function") return;
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

var timeline = (function MasterTimeline() {
  var tl;
  var win = window;

  function doClickTag() { window.open(window.clickTag); }

  function initTimeline() {
    document.querySelector("#clickthrough-button").onclick = doClickTag;
    tl = createTimeline();
    win.dispatchEvent(new CustomEvent("start", { detail: { hasStarted: true } }));
  }

  function createTimeline() {
    var mainTl = gsap.timeline({
      paused: false,
      onComplete: function () {
        win.dispatchEvent(new CustomEvent("complete", { detail: { hasStopped: true } }));
      },
    });

    mainTl
      .set(".red-bar", { autoAlpha: 0, x: -8 })
      .set(".divider", { autoAlpha: 0, scaleY: 0.6, transformOrigin: "top" })
      .set(".logo", { autoAlpha: 1, y: 22 })
      .set(".cta", { autoAlpha: 0 })
      .set(".headline", { autoAlpha: 0, y: 14 })
      .addLabel("start")
      .to(".red-bar", { duration: 0.5, autoAlpha: 1, x: 0, ease: "power2.out" }, "start")
      .to(".headline-3", { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }, "start+=0.45")
      .to(".headline-4", { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }, "start+=0.6")
      .to(".headline-3", { duration: 0.45, autoAlpha: 0, ease: "power2.in" }, "start+=1.8")
      .to(".headline-4", { duration: 0.45, autoAlpha: 0, ease: "power2.in" }, "start+=1.85")
      .to(".headline-1", { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }, "start+=2.15")
      .to(".headline-2", { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }, "start+=2.3")
      .to(".logo", { duration: 0.6, y: 0, ease: "power2.out" }, "start+=2.95")
      .to(".cta", { duration: 0.55, autoAlpha: 1, ease: "power2.out" }, "start+=3.6");

    return mainTl;
  }

  function getTimeline() { return tl; }
  return { init: initTimeline, get: getTimeline };
})();

(function (funcName, baseObj) {
  "use strict";
  funcName = funcName || "documentReady";
  baseObj = baseObj || window;
  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  function ready() {
    if (!readyFired) {
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      readyList = [];
    }
  }
  function readyStateChange() {
    if (document.readyState === "complete") ready();
  }
  baseObj[funcName] = function (callback, context) {
    if (readyFired) {
      setTimeout(function () { callback(context); }, 1);
      return;
    } else {
      readyList.push({ fn: callback, ctx: context });
    }
    if (document.readyState === "complete") {
      setTimeout(ready, 1);
    } else if (!readyEventHandlersInstalled) {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", ready, false);
        window.addEventListener("load", ready, false);
      } else {
        document.attachEvent("onreadystatechange", readyStateChange);
        window.attachEvent("onload", ready);
      }
      readyEventHandlersInstalled = true;
    }
  };
})("documentReady", window);

function initBanner() {
  if (typeof gsap !== "undefined") {
    document.querySelector(".banner").style.display = "block";
    timeline.init();
  } else {
    setTimeout(initBanner, 50);
  }
}

window.documentReady(initBanner);
