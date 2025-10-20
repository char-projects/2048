export function createTile(value) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = value === 0 ? '' : String(value);
    if (value > 0) tile.dataset.value = String(value);
    return tile;
}

export function updateTile(tileEl, value) {
    tileEl.textContent = value === 0 ? '' : String(value);
    if (value > 0) tileEl.dataset.value = String(value);
    else tileEl.removeAttribute('data-value');
    return tileEl;
}

export function tileClassForValue(value) {
    return `tile-${value}`;
}