import "@material/mwc-button";
import type { CSSResultGroup } from "lit";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators";
import { supportsFeature } from "../common/entity/supports-feature";
import type { LawnMowerEntity, LawnMowerEntityState } from "../data/lawn_mower";
import { LawnMowerEntityFeature } from "../data/lawn_mower";
import type { HomeAssistant } from "../types";

type LawnMowerAction = {
  action: string;
  service: string;
  feature: LawnMowerEntityFeature;
};

const LAWN_MOWER_ACTIONS: Partial<
  Record<LawnMowerEntityState, LawnMowerAction>
> = {
  mowing: {
    action: "dock",
    service: "dock",
    feature: LawnMowerEntityFeature.DOCK,
  },
  docked: {
    action: "start_mowing",
    service: "start_mowing",
    feature: LawnMowerEntityFeature.START_MOWING,
  },
  returning: {
    action: "pause",
    service: "pause",
    feature: LawnMowerEntityFeature.PAUSE,
  },
  paused: {
    action: "resume_mowing",
    service: "start_mowing",
    feature: LawnMowerEntityFeature.START_MOWING,
  },
};

@customElement("ha-lawn_mower-action-button")
class HaLawnMowerActionButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public stateObj!: LawnMowerEntity;

  public render() {
    const state = this.stateObj.state;
    const action = LAWN_MOWER_ACTIONS[state];

    if (action && supportsFeature(this.stateObj, action.feature)) {
      return html`
        <mwc-button @click=${this.callService} .service=${action.service}>
          ${this.hass.localize(`ui.card.lawn_mower.actions.${action.action}`)}
        </mwc-button>
      `;
    }

    return html`
      <mwc-button disabled>
        ${this.hass.formatEntityState(this.stateObj)}
      </mwc-button>
    `;
  }

  callService(ev) {
    ev.stopPropagation();
    const stateObj = this.stateObj;
    const service = ev.target.service;
    this.hass.callService("lawn_mower", service, {
      entity_id: stateObj.entity_id,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      mwc-button {
        top: 3px;
        height: 37px;
        margin-right: -0.57em;
        margin-inline-end: -0.57em;
        margin-inline-start: initial;
      }
      mwc-button[disabled] {
        background-color: transparent;
        color: var(--secondary-text-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-lawn_mower-action-button": HaLawnMowerActionButton;
  }
}
