// helper — add to common.js so all pages can use it
const setLoading = (btn, loading) => {
    if (loading) {
        btn.disabled = true
        btn.dataset.original = btn.innerHTML
        btn.innerHTML = `
            <svg class="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
        `
        btn.classList.add('opacity-70', 'cursor-not-allowed')
    } else {
        btn.disabled = false
        btn.innerHTML = btn.dataset.original
        btn.classList.remove('opacity-70', 'cursor-not-allowed')
    }
}