import * as React from "react";
import styles from "./SecondWebPart.module.scss";
import type { ISecondWebPartProps } from "./ISecondWebPartProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class SecondWebPart extends React.Component<ISecondWebPartProps, {}> {
  public render(): React.ReactElement<ISecondWebPartProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,

      title,
      multilineText, 
      layout, 
      theme, 
      enableFeatureX, 
      agreeToTerms, 
      customValue, 
      optionChoice, 
    } = this.props;

    return (
      <section
        className={`${styles.secondWebPart} ${hasTeamsContext ? styles.teams : ""}`}
      >
        {/* Welcome section */}
        <div className={styles.welcome}>
          <img
            alt=""
            src={
              isDarkTheme
                ? require("../assets/welcome-dark.png")
                : require("../assets/welcome-light.png")
            }
            className={styles.welcomeImage}
          />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>
            Web part property value: <strong>{escape(description)}</strong>
          </div>
        </div>

        <div className={`webpart-container theme-${theme}`}>

          <h2>{escape(title)}</h2>

          <p>{escape(description)}</p>

          <p>{escape(multilineText)}</p>

          <div className={`layout-${layout}`}>
            {layout === "grid" ? (
              <div className="grid-layout">Grid Layout</div>
            ) : (
              <div className="list-layout">List Layout</div>
            )}
          </div>

          {enableFeatureX && (
            <div className="feature-x">
              <p>Feature X is enabled!</p>
            </div>
          )}

          {agreeToTerms && (
            <div className="agreement">
              <p>You have agreed to the terms and conditions.</p>
            </div>
          )}

          <div className="slider-value">
            <p>Custom Slider Value: {customValue}</p>
          </div>

          <div className="choice-group">
            <p>Selected Option: {optionChoice}</p>
          </div>
        </div>
      </section>
    );
  }
}
