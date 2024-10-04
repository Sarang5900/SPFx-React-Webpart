import * as React from 'react';
import styles from './GroupOfProperties.module.scss';
import type { IGroupOfPropertiesProps } from './IGroupOfPropertiesProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class GroupOfProperties extends React.Component<IGroupOfPropertiesProps, {}> {
  public render(): React.ReactElement<IGroupOfPropertiesProps> {
    const {
      property1,
      property2,
      property3,
      property4,
      property5,
      property6,
      property7,
      property8
    } = this.props; // Destructuring props for easier use

    return (
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Web Part Properties</h3>
          </div>
          <div className={styles.cardBody}>
            <p><strong>Property 1:</strong> {escape(property1)}</p>
            <p><strong>Property 2:</strong> {escape(property2)}</p>
            <p><strong>Property 3:</strong> {escape(property3)}</p>
            <p><strong>Property 4:</strong> {property4 ? 'On' : 'Off'}</p>
            <p><strong>Property 5:</strong> {property5}</p>
            <p><strong>Property 6:</strong> {property6 ? 'Checked' : 'Unchecked'}</p>
            <p>
              <a href="https://example.com" target="_blank"  rel="noopener noreferrer">
                Link: {escape(property7)}
              </a>
            </p>
            {property8 && <p>{escape(property8)}</p>}
          </div>
        </div>
      </div>
    );
  }
}
