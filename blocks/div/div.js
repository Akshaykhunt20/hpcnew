export default function decorate(block) {
  const cols = [...block.firstElementChild.children];

  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const code = col.querySelector('code');
      if (code) {
        const divWrapper = code.textContent;
        const temp = document.createElement('div');
        temp.className = divWrapper;
        col.innerHTML = temp.outerHTML;
      }
    });
  });
}
