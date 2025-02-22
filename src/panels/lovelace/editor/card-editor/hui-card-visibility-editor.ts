import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";
import { fireEvent } from "../../../../common/dom/fire_event";
import "../../../../components/ha-alert";
import type { LovelaceCardConfig } from "../../../../data/lovelace/config/card";
import type { HomeAssistant } from "../../../../types";
import type { Condition } from "../../common/validate-condition";
import "../conditions/ha-card-conditions-editor";

@customElement("hui-card-visibility-editor")
export class HuiCardVisibilityEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public config!: LovelaceCardConfig;

  render() {
    const conditions = this.config.visibility ?? [];
    return html`
      <p class="intro">
        ${this.hass.localize(
          `ui.panel.lovelace.editor.edit_card.visibility.explanation`
        )}
      </p>
      <ha-card-conditions-editor
        .hass=${this.hass}
        .conditions=${conditions}
        @value-changed=${this._valueChanged}
      >
      </ha-card-conditions-editor>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const conditions = ev.detail.value as Condition[];
    const newConfig: LovelaceCardConfig = {
      ...this.config,
      visibility: conditions,
    };
    if (newConfig.visibility?.length === 0) {
      delete newConfig.visibility;
    }
    fireEvent(this, "value-changed", { value: newConfig });
  }

  static styles = css`
    .intro {
      margin: 0;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-card-visibility-editor": HuiCardVisibilityEditor;
  }
}
