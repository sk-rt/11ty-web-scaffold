/**
 * Toggle element by controller
 * @example
 * ```
 * <button data-toggle-control="targetid">Toggle</button>
 * <div data-toggle-id="targetid">
 * Content
 * </div>
 * ```
 *
 */
import addListener, { RemoveListener } from '../utils/eventHandler';
export interface ToggleParams {
  nameSpace: string;
  activeClass: string;
  onShow: (targetToggleID?: string, targetEl?: HTMLElement) => void;
  onHide: (targetToggleID?: string, targetEl?: HTMLElement) => void;
}
export type ToggleActions = 'SHOW' | 'HIDE' | 'TOGGLE';

export class ToggleController {
  params: ToggleParams;
  removeListeners: RemoveListener[] = [];
  toggleControlSelector: string;
  toggleActionSelector: string;
  constructor(params: Partial<ToggleParams>) {
    this.params = {
      nameSpace: 'toggle',
      activeClass: 'is-active',
      onShow: () => {},
      onHide: () => {},
      ...params,
    };
    this.toggleControlSelector = `data-${this.params.nameSpace}-control`;
    this.toggleActionSelector = `data-${this.params.nameSpace}-action`;
    this.removeListeners = this.init();
  }
  init() {
    const targetEls = document.querySelectorAll(`[${this.toggleControlSelector}]`);
    return [].slice.call(targetEls).map((element: HTMLElement) => {
      return addListener(
        element,
        'click',
        () => {
          const targetID = element.getAttribute(this.toggleControlSelector);
          const action: ToggleActions = ((_action) => {
            switch (_action) {
              case 'SHOW':
              case 'HIDE':
                return _action;
              default:
                return 'TOGGLE';
            }
          })(element.getAttribute(this.toggleActionSelector));

          if (targetID) {
            this.toggle(targetID, action);
          }
        },
        false
      );
    });
  }
  destroy() {
    if (this.removeListeners.length !== 0) {
      this.removeListeners.forEach((f) => f());
    }
  }
  toggle(targetToggleID: string, mehtod: ToggleActions) {
    const targetEls = document.querySelectorAll(
      `[data-${this.params.nameSpace}-id=${targetToggleID}]`
    );
    [].slice.call(targetEls).forEach((element: HTMLElement) => {
      const addClass =
        element.getAttribute(`data-${this.params.nameSpace}-class`) || this.params.activeClass;
      const isShown = element.classList.contains(addClass);

      const show = () => {
        element.classList.add(addClass);
        element.setAttribute('aria-hidden', 'false');
        this.params.onShow(targetToggleID, element);
      };
      const hide = () => {
        element.setAttribute('aria-hidden', 'true');
        element.classList.remove(addClass);
        this.params.onHide(targetToggleID, element);
      };
      switch (mehtod) {
        case 'SHOW':
          show();
          break;
        case 'HIDE':
          hide();
          break;
        default:
          if (isShown) {
            hide();
          } else {
            show();
          }
      }
    });
  }
}
