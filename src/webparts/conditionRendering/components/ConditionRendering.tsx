import * as React from 'react';
import styles from './ConditionRendering.module.scss';
import type { IConditionRenderingProps } from './IConditionRenderingProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ConditionRendering extends React.Component<IConditionRenderingProps, {}> {
  public render(): React.ReactElement<IConditionRenderingProps> {
    const { 
      description,
      showTextField,
      textFieldValue,
      enableFeature,
      selectedOption,
      choiceGroupOption,
      sliderValue
    } = this.props;

    return (
      <section className={styles.conditionRendering}>
        <div className={styles.card}>
          <h2>Web Part Settings</h2>
          <p>Web part property value: <strong>{escape(description)}</strong></p>
        </div>
        
        {showTextField && (
          <div className={styles.card}>
            <h3>Text Field</h3>
            <p>Text Field Value: <strong>{escape(textFieldValue)}</strong></p>
          </div>
        )}

        {enableFeature && (
          <div className={styles.card}>
            <h3>Feature Settings</h3>
            <div>
              <strong>Selected Option:</strong> {selectedOption}
            </div>
            <div>
              <strong>Choice Group Option:</strong> {choiceGroupOption}
            </div>
            <div>
              <strong>Slider Value:</strong> {sliderValue}
            </div>
          </div>
        )}
      </section>
    );
  }
}
