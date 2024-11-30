// script.js

// Select the cursor element
const cursor = document.querySelector(".cursor")

// Move the cursor to the mouse position
document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.pageX}px`
  cursor.style.top = `${e.pageY}px`
})

// Make the cursor grow on click
document.addEventListener("mousedown", () => {
  cursor.classList.add("cursor-grow")
})

// Revert to normal size on mouse up
document.addEventListener("mouseup", () => {
  cursor.classList.remove("cursor-grow")
})
