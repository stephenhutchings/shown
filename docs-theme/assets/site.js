/* global anchors */

// add anchor links to headers
anchors.options.placement = "left"
anchors.add("h2")

// Filter UI
var tocElements = document.getElementById("toc").getElementsByTagName("li")

var items = document.getElementsByClassName("toggle-sibling")
for (var j = 0; j < items.length; j++) {
  items[j].addEventListener("click", toggleSibling)
}

function toggleSibling() {
  var stepSibling = this.parentNode.getElementsByClassName("toggle-target")[0]
  var icon = this.getElementsByClassName("icon")[0]
  var klass = "display-none"
  if (stepSibling.classList.contains(klass)) {
    stepSibling.classList.remove(klass)
    icon.innerHTML = "▾"
  } else {
    stepSibling.classList.add(klass)
    icon.innerHTML = "▸"
  }
}

function showHashTarget(targetId) {
  if (targetId) {
    var hashTarget = document.getElementById(targetId)
    // new target is hidden
    if (
      hashTarget &&
      hashTarget.offsetHeight === 0 &&
      hashTarget.parentNode.parentNode.classList.contains("display-none")
    ) {
      hashTarget.parentNode.parentNode.classList.remove("display-none")
    }
  }
}

function scrollIntoView(targetId) {
  // Only scroll to element if we don't have a stored scroll position.
  if (targetId && !history.state) {
    var hashTarget = document.getElementById(targetId)
    if (hashTarget) {
      hashTarget.scrollIntoView()
    }
  }
}

function gotoCurrentTarget() {
  showHashTarget(location.hash.substring(1))
  scrollIntoView(location.hash.substring(1))
}

window.addEventListener("hashchange", gotoCurrentTarget)
gotoCurrentTarget()

var toclinks = document.getElementsByClassName("pre-open")
for (var k = 0; k < toclinks.length; k++) {
  toclinks[k].addEventListener("mousedown", preOpen, false)
}

function preOpen() {
  showHashTarget(this.hash.substring(1))
}

// Chrome doesn't remember scroll position properly so do it ourselves.
// Also works on Firefox and Edge.

function updateState() {
  history.replaceState({}, document.title)
}

function loadState(ev) {
  if (ev) {
    // Edge doesn't replace change history.state on popstate.
    history.replaceState(ev.state, document.title)
  }
}

window.addEventListener("load", function () {
  // Restore after Firefox scrolls to hash.
  setTimeout(function () {
    loadState()
    // Update with initial scroll position.
    updateState()
  }, 1)
})

window.addEventListener("popstate", loadState)
