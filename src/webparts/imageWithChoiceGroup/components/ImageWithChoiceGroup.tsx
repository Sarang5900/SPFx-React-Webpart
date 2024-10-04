import * as React from 'react';
import styles from './ImageWithChoiceGroup.module.scss';
import type { IImageWithChoiceGroupProps } from './IImageWithChoiceGroupProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { Image, ImageFit } from '@fluentui/react/lib/Image';

type ImageKey = 'A' | 'B' | 'C';

export default class ImageWithChoiceGroup extends React.Component<IImageWithChoiceGroupProps, { selectedKey: ImageKey }> {
  constructor(props: IImageWithChoiceGroupProps) {
    super(props);
    this.state = {
      selectedKey: 'A' // Default selection
    };
  }

  private onChange = (ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void => {
    if (option) {
      this.setState({ selectedKey: option.key as ImageKey });
    }
  };

  public render(): React.ReactElement<IImageWithChoiceGroupProps> {
    const { description } = this.props;
    const { selectedKey } = this.state;

    const options: IChoiceGroupOption[] = [
      { key: 'A', text: 'Option A' },
      { key: 'B', text: 'Option B' },
      { key: 'C', text: 'Option C' }
    ];

    const images: Record<ImageKey, string> = {
      A: "https://images.pexels.com/photos/169524/pexels-photo-169524.jpeg?auto=compress&cs=tinysrgb&w=600",

      B: "https://images.pexels.com/photos/6898861/pexels-photo-6898861.jpeg?auto=compress&cs=tinysrgb&w=600",

      C: "https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=600"
    };

    return (
      <div className={styles.container}>
        <div>Web part property value: <strong>{escape(description)}</strong></div>
        
        <ChoiceGroup
          label="Pick one image option"
          options={options}
          onChange={this.onChange}
          selectedKey={selectedKey}
        />

        <div className={styles.cardContainer}>
          {selectedKey && (
            <div className={styles.card}>
              <Image
                src={images[selectedKey]}
                alt={`Option ${selectedKey}`}
                width={300}
                height={300}
                imageFit={ImageFit.cover}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
