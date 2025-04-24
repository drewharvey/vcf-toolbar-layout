/*-
 * #%L
 *
 * Copyright (C) 2024 - 2025 Vaadin Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import '@vaadin/button';
import '@vaadin/popover';
import '@vaadin/vertical-layout';
import { Popover } from '@vaadin/popover';

@customElement('vcf-toolbar-layout')
export class VcfToolbarLayout extends ResizeMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LitElement)))
) {

  static get is() {
    return 'vcf-toolbar-layout';
  }

  static get version() {
    return '1.0.0';
  }

  static get styles() {
    return css`
      :host {
        --vcf-toolbar-align-items: baseline;
        --vcf-toolbar-layout-gap: var(--lumo-space-s);

        display: flex;
        align-items: var(--vcf-toolbar-align-items);
        position: relative;
        min-width: 0;           /* Allow the host to shrink smaller children */
        overflow: visible;      /* Ensure the popover can overflow the host */
        contain: layout;
        width: 100%;
        gap: var(--vcf-toolbar-layout-gap););
      }

      /* Overflow button is hidden unless needed */
      [slot='overflow-button'] {
        display: none;
      }
      [slot='overflow-button'].visible {
        display: initial;
      }

      :host([reverse-collapse]) [slot='overflow-button'] {
        order: -1;
      }
    `;
  }

  // overflow container is attached to the popover overlay (different shadow root) so we need to inject styles globally
  protected readonly _overflowContainerStyles: string = `
    /* Hide label on icon buttons */
    vcf-toolbar-layout vaadin-button[theme~="icon"]::part(label) {
      display: none;
    }
  
    .overflow-container {
      --overflow-container-padding: var(--lumo-space-s);
      --overflow-container-item-gap: var(--lumo-space-xs);
      --overflow-container-text-color: var(--lumo-body-text-color);
      --overflow-container-prefix-suffix-color: var(--lumo-tertiary-text-color);

      /* vaadin component overrides */
      --vaadin-button-background: transparent;
      --vaadin-button-text-color: var(--lumo-body-text-color);
      --vaadin-button-font-weight: 400;

      align-items: stretch;
      gap: var(--overflow-container-item-gap);
      padding: var(--overflow-container-padding);
    }
    
    vaadin-popover-overlay[theme~="fixed-width-prefix"] .overflow-container {
      --overflow-container-prefix-width: var(--lumo-space-l);
    }

    /* native element styles */
    vcf-toolbar-layout  hr {
      display: inline-block;
      flex-shrink: 0;
      align-self: stretch;
      width: 1px;
      height: auto;
      border: none;
      background-color: var(--lumo-contrast-10pct);
      margin: var(--lumo-space-xs);
    }
    
    vcf-toolbar-layout hr:last-child {
      visibility: hidden;
      margin: 0;
      margin-right: calc(-1 * var(--vcf-toolbar-layout-gap));
      width: 0;
    }
    
    .overflow-container > hr:first-child {
      display: none;
    }

    .overflow-container > hr {
      border: none;
      background-color: var(--lumo-contrast-10pct);
      margin: 0;
      height: 1px;
      width: 100%;
    }

    .overflow-container > a {
      display: flex;
      align-items: center;
    }

    /* vaadin component styles */
    
    :not([theme~="error"]):not([theme~="success"]):not([theme~="warning"])::part(prefix),
    :not([theme~="error"]):not([theme~="success"]):not([theme~="warning"])::part(suffix) {
      color: var(--overflow-container-prefix-suffix-color);
    }
    
    .overflow-container > [has-label]:first-child {
      padding-top: 0;
    }
    
    .overflow-container > [has-label] {
      padding-top: var(--lumo-space-s);
    }
    
    vcf-toolbar-layout > vaadin-menu-bar > vaadin-menu-bar-button {
      width: unset !important;
    }

    .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button > vaadin-menu-bar-item {
      justify-content: left;
    }

    .overflow-container > vaadin-button,
    .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button {
      --vaadin-button-padding: var(--lumo-space-s);
      --vaadin-button-margin: 0px;
    }
    
    .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button {
      width: unset !important;
      flex: 1;
    }
    
    .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button > vaadin-menu-bar-item {
      width: 100%;
    }
    
    .overflow-container > vaadin-button[theme~="primary"] {
      background: var(--vaadin-button-background);
      color: var(--lumo-primary-text-color);
      font-weight: var(--vaadin-button-font-weight);
    }
    
    .overflow-container > vaadin-button[theme~="icon"]::part(prefix) {
      margin-left: -0.25em;
      margin-right: 0.25em;
    }
    
    /* Theme variant to hide prefix & suffix in overflow container */
    vaadin-popover-overlay[theme~="hide-icons"] .overflow-container > vaadin-button::part(prefix),
    vaadin-popover-overlay[theme~="hide-icons"] .overflow-container > vaadin-button::part(suffix),
    vaadin-popover-overlay[theme~="hide-icons"] .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button::part(prefix),
    vaadin-popover-overlay[theme~="hide-icons"] .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button::part(suffix) {
      display: none;
    }

    .overflow-container > vaadin-button::part(label),
    .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button::part(label) {
      text-align: left;
      flex-grow: 1;
    }
    
    .overflow-container > ::part(input-field) {
      padding: 0 var(--lumo-space-xs);
    }
    
    .overflow-container > a {
      padding: 0 var(--lumo-space-s);
      height: var(--lumo-size-m);
    }
    
    /* Theme variant forcing horizonal alignment of prefixes */
    vaadin-popover-overlay[theme~="fixed-width-prefix"] .overflow-container > vaadin-button::part(prefix),
    vaadin-popover-overlay[theme~="fixed-width-prefix"] .overflow-container > vaadin-menu-bar > vaadin-menu-bar-button::part(prefix) {
      width: var(--overflow-container-prefix-width);
    }
    
    vaadin-popover-overlay[theme~="fixed-width-prefix"] .overflow-container > a {
      padding-left: calc(var(--lumo-space-s) + 0.2em + var(--overflow-container-prefix-width, 0px));
    }
  `;

  @property({ type: String, reflect: true })
  theme: string | null = null;

  /**
   * If true, the buttons will be collapsed into the overflow menu
   * starting from the "start" end of the bar instead of the "end".
   * @attr {boolean} reverse-collapse
   */
  @property({ type: Boolean, reflect: true })
  reverseCollapse: boolean = false;

  /**
   * The delay in milliseconds to debounce the overflow update after a resize.
   */
  @property({ type: Number, reflect: true })
  updateDebounceDelay: number = 20;

  protected _overflowContainer!: HTMLElement;
  protected _overflowButton!: HTMLElement;
  private __resizeObserver!: ResizeObserver;
  private __updateTimeout: NodeJS.Timeout | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    console.log('connectedCallback');

    // inject global styles for the overflow container since it will be moved to a different shadow root (popover overlay)
    this._injectGlobalStyles();

    // listen for resize events
    this.__resizeObserver = new ResizeObserver(this._requestOverflowUpdate.bind(this));
    this.__resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    console.log('disconnectedCallback');

    // remove global styles
    this._removeGlobalStyles();

    // remove resize observer
    this.__resizeObserver.disconnect();

    // clear any pending update
    if (this.__updateTimeout) {
      clearTimeout(this.__updateTimeout);
      this.__updateTimeout = null;
    }
  }

  protected firstUpdated() {
    if (!this.shadowRoot) {
      console.error('Shadow root not found');
      return;
    }

    // get the overflow button
    this._overflowButton = this.shadowRoot.querySelector('[slot="overflow-button"]') as HTMLElement;

    // setup oveflow container
    this._overflowContainer = document.createElement('vaadin-vertical-layout');
    this._overflowContainer.classList.add('overflow-container');

    // setup the popover
    let popover: Popover = this.shadowRoot.querySelector('vaadin-popover') as Popover;
    popover.setAttribute('for', 'overflow-button');
    popover.setAttribute("overlay-role", "menu");
    popover.setAttribute('accessible-name-ref', "overflowed menu items");
    popover.setAttribute('position', 'bottom-start');
    popover.setAttribute('modal', 'true');
    popover.renderer = (root: Element) => {
      // Ensure content is only added once
      if (!root.firstChild) {
        root.appendChild(this._overflowContainer!);
      }
    };

    // process overflow items to set initial state
    // for some reason, button width is ignored unless we need to wait for the next frame
    setTimeout(() => this._updateOverflowingItems(), 0);
  }

  render() {
    return html`
      <slot></slot>
      <slot name="menu"></slot>
      <slot name="overflow-button"></slot>

      <!-- todo: move this to be dynamically created so dev can provide their own button if desired -->
      <vaadin-button
        id="overflow-button"
        part="overflow-button"
        slot="overflow-button"
        theme="icon"
      >
        <vaadin-icon icon="vaadin:ellipsis-dots-v"></vaadin-icon>
      </vaadin-button>
      <vaadin-popover
        part="popover"
        theme="no-padding ${this.theme}"
      ></vaadin-popover>
    `;
  }

  /**
   * Request an update to the overflow items. This method debounces the update.
   */
  protected _requestOverflowUpdate() {
    if (this.__updateTimeout) {
      clearTimeout(this.__updateTimeout);
    }
    this.__updateTimeout = setTimeout(() => this._updateOverflowingItems(), this.updateDebounceDelay);
  }

  /**
   * Move elements between the main container and the overflow container.
   * Elements in the main container are visisble as normal.
   * Elements in the overflow container are hidden and only shown when the overflow button is clicked.
   */
  protected _updateOverflowingItems() {
    console.log('Update overflowing items');

    // todo: include container gap/padding/etc value in calculation?
    const overflowButtonWidth = this._overflowButton ? this._overflowButton.getBoundingClientRect().width : 0;

    const visibleItems = this._getVisibleItems();
    const lastVisibleItem = visibleItems.length > 0 ? visibleItems[visibleItems.length - 1] : null;

    const overflowedItems = this._getOverflowedItems();

    // if the right-most item is visible in the container, then we might need to move overflow items back into the main container
    if (!lastVisibleItem || this._isElementVisibleInContainer(lastVisibleItem, this, overflowButtonWidth)) {
      while (overflowedItems.length > 0) {
        // temporarily move the item to the main container, then check for clipping
        let overflowedItem = this.reverseCollapse ? overflowedItems[overflowedItems.length - 1] : overflowedItems[0];
        this._moveItemToMainContainer(overflowedItem);

        // check the right-most visible item for clipping
        const updatedVisibleItems = this._getVisibleItems(); // <-- not optimal, but we need to get the updated list of visible items
        let lastItem = this.reverseCollapse ? updatedVisibleItems[updatedVisibleItems.length - 1] : overflowedItem;
        if (!this._isElementVisibleInContainer(lastItem, this, overflowButtonWidth)) {
          this._moveItemToOverflowContainer(overflowedItem);
          break;
        }

        // remove from the overflowed items
        overflowedItems.splice(overflowedItems.indexOf(overflowedItem), 1); 
      }
    } else {
      // move items from the main container to the overflow container if they are clipped
      // loop in reverse so that the right-most item is checked first
      while (visibleItems.length > 0) {
        let item = visibleItems[visibleItems.length - 1];

        // normally we need to add the overflow button width, since the button sits to the right of the items, 
        // but in reverse collapse mode, if the button is visible, it is on the left so we don't need to add its width
        const extraSpaceRequired = (this.reverseCollapse && this._isOverflowButtonVisible()) ? 0 : overflowButtonWidth;
        if (this._isElementVisibleInContainer(item, this, extraSpaceRequired)) {
          break;
        }

        // if reverse collapse mode, we actually move the left-most item to the overflow container instead
        item = this.reverseCollapse ? visibleItems[0] : item;

        // move item to overflow container
        this._moveItemToOverflowContainer(item);

        // remove from the visible items
        visibleItems.splice(visibleItems.indexOf(item), 1);
      }
    }

    // show the overflow button if there are items in the overflow container
    this._updateOverflowButtonState();
  }

  /**
   * Check if the element is visible in the container.
   * @param element 
   * @param container 
   * @param extraSpaceRequired 
   * @returns 
   */
  protected _isElementVisibleInContainer(element: Element, container: Element, extraSpaceRequired: number = 0): boolean {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    return (
      // elementRect.top >= containerRect.top &&
      // elementRect.left >= containerRect.left &&
      // elementRect.bottom <= containerRect.bottom &&
      (elementRect.right + extraSpaceRequired) <= containerRect.right
    );
  }

  protected _getVisibleItems(): Element[] {
    return Array.from(this.querySelectorAll(':scope > *'));
  }      

  protected _getOverflowedItems(): Element[] {
    return Array.from(this._overflowContainer.querySelectorAll(':scope > *'));
  }

  protected _moveItemToOverflowContainer(item: Element) {
    item.remove();

    if (this.reverseCollapse) {
      // if reverse collapse mode, we need to insert at the end of the overflow container
      this._overflowContainer.appendChild(item);
    } else {
      // must insert at beginning of overflow container to ensure order stays consistent with normal menu
      this._overflowContainer.insertBefore(item, this._overflowContainer.firstChild);
    }
    
    console.log('Moved item to overflow container:', item);
  }

  protected _moveItemToMainContainer(item: Element) {
    item.remove();
    
    if (this.reverseCollapse) {
      // if reverse collapse mode, we need to insert at the beginning of the main container
      this.insertBefore(item, this.children[0]);
    }  else {
      // must insert at end of main container to ensure order stays consistent with normal menu
      this.appendChild(item);
    }
    
    console.log('Moved item to main container:', item);
  }

  /**
   * Refresh the overflow button's state.
   */
  protected _updateOverflowButtonState() {
    if (this._getOverflowedItems().length > 0) {
      this._overflowButton.classList.add('visible');
    } else {
      this._overflowButton.classList.remove('visible');
    }
  }

  protected _isOverflowButtonVisible(): boolean {
    return this._overflowButton.classList.contains('visible');
  }

  protected _injectGlobalStyles() {
    const styleId = 'overflow-container-styles';

    // avoid injecting duplicates
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this._overflowContainerStyles;
    document.head.appendChild(style);
  }

  protected _removeGlobalStyles() {
    const styleId = 'overflow-container-styles';
    const style = document.getElementById(styleId);
    if (style) {
      style.remove();
    }
  }
}
