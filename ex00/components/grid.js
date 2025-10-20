export default function Grid(size = 4) {
    const frag = document.createDocumentFragment();
    const total = size * size;
    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = String(i);
        frag.appendChild(cell);
    }
    return frag;
}