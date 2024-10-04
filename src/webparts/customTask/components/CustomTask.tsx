import * as React from "react";
import styles from "./CustomTask.module.scss"
import type { ICustomTaskProps } from "./ICustomTaskProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Slider,
  ChoiceGroup,
  IChoiceGroupOption
} from "@fluentui/react";
import { ICustomTaskState } from "./ICustomTaskState";

export default class CustomTask extends React.Component<ICustomTaskProps,ICustomTaskState> {
  constructor(props: ICustomTaskProps) {
    super(props);
    this.state = {
      headingSize: 24,
      subheadingSize: 18,
      alignment: "left",
    };
  }

  private _onHeadingSizeChange = (value: number): void => {
    this.setState({ headingSize: value });
  };

  private _onSubheadingSizeChange = (value: number): void => {
    this.setState({ subheadingSize: value });
  };

  private _onAlignmentChange = (
    event: React.FormEvent<HTMLElement>,
    option?: IChoiceGroupOption
  ): void => {
    if (option) {
      this.setState({ alignment: option.key as "left" | "center" | "right" });
    }
  };

  public render(): React.ReactElement<ICustomTaskProps> {
    const { description } = this.props;
    const { 
      headingSize, 
      subheadingSize, 
      alignment 
    } = this.state;

    return (
      <section className={`${styles.customTask}`}>
        <div className={styles.welcome}>
          <Slider
            label="Heading Size"
            min={10}
            max={100}
            step={1}
            value={headingSize}
            onChange={this._onHeadingSizeChange}
          />
          <Slider
            label="Subheading Size"
            min={10}
            max={100}
            step={1}
            value={subheadingSize}
            onChange={this._onSubheadingSizeChange}
          />
          <ChoiceGroup
            label="Alignment"
            selectedKey={alignment}
            onChange={this._onAlignmentChange}
            options={[
              { key: "left", text: "Left" },
              { key: "center", text: "Center" },
              { key: "right", text: "Right" },
            ]}
          />
          <div style={{ textAlign: alignment }}>
            <h1 style={{ fontSize: `${headingSize}px` }}>Heading</h1>
            <h2 style={{ fontSize: `${subheadingSize}px` }}>Subheading</h2>
            <div>
              Web part property value: <strong>{escape(description)}</strong>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
