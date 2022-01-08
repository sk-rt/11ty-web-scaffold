/***********************************


ナビにカレントclass追加


************************************/
export const currentNavi = () => {
  const canonical = location.pathname;
  const navAttr = `data-nav-slug`;
  const navElms: HTMLElement[] = [].slice.call(document.querySelectorAll(`[${navAttr}]`));
  if (navElms.length === 0 || canonical === (window as any).WP_HOME) {
    return;
  }
  navElms.forEach((elm) => {
    const navslugs = elm.getAttribute(navAttr)?.split(',');
    if (!navslugs) {
      return;
    }
    if (canonical.match(new RegExp(navslugs.join('|')))) {
      elm.classList.add('is-current');
    } else {
      elm.classList.remove('is-current');
    }
  });
};
