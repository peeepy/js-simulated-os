document.addEventListener("DOMContentLoaded", () => {
  const searchIcons = document.querySelectorAll(".search-icon")
  const searchBars = document.querySelectorAll(".search-bar")
  const activeSearches = new Set()

  searchIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const targetId = icon.getAttribute("data-search-target")
      const searchBar = document.getElementById(targetId)

      if (!searchBar) return

      const isActive = icon.classList.toggle("active")
      searchBar.classList.toggle("active")

      if (isActive) {
        activeSearches.add(targetId)
        const input = searchBar.querySelector("input")
        if (input) input.focus()
      } else {
        activeSearches.delete(targetId)
        const input = searchBar.querySelector("input")
        if (input) input.value = ""
      }

      e.stopPropagation()
    })
  })

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    activeSearches.forEach((targetId) => {
      const icon = document.querySelector(`[data-search-target="${targetId}"]`)
      const searchBar = document.getElementById(targetId)

      if (icon && searchBar && !icon.contains(e.target) && !searchBar.contains(e.target)) {
        icon.classList.remove("active")
        searchBar.classList.remove("active")
        activeSearches.delete(targetId)
        const input = searchBar.querySelector("input")
        if (input) input.value = ""
      }
    })
  })

  // Close search when pressing Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      activeSearches.forEach((targetId) => {
        const icon = document.querySelector(`[data-search-target="${targetId}"]`)
        const searchBar = document.getElementById(targetId)

        if (icon && searchBar) {
          icon.classList.remove("active")
          searchBar.classList.remove("active")
          activeSearches.delete(targetId)
          const input = searchBar.querySelector("input")
          if (input) input.value = ""
        }
      })
    }
  })
})

