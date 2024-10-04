import * as React from 'react';
import { IPropertyControlProps } from './IPropertyControlProps';
import styles from './PropertyControl.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';

const dropdownOptions: IDropdownOption[] = [
  { key: 'option1', text: 'Option 1' },
  { key: 'option2', text: 'Option 2' }
];

// Define stack tokens for spacing
const stackTokens: IStackTokens = { childrenGap: 15 };

export default class PropertyControl extends React.Component<IPropertyControlProps, {}> {
  public render(): React.ReactElement<IPropertyControlProps> {
    const { description, page1Property, page2Property } = this.props;

    return (
      <div className={styles.propertyControl}>
        <Stack 
          className={styles.card} 
          tokens={stackTokens} 
          horizontalAlign="center" 
          verticalAlign="center"
          styles={{ root: { width: '100%', maxWidth: '400px', padding: '20px' } }}
        >
          <Stack.Item>
            <h2 className={styles.title}>Property Control Web Part</h2>
          </Stack.Item>

          <Stack.Item>
            <TextField 
              label="Web Part Description" 
              value={escape(description)} 
              readOnly 
            />
          </Stack.Item>

          <Stack.Item>
            <TextField 
              label="Page 1 Property" 
              value={escape(page1Property)} 
              readOnly 
            />
          </Stack.Item>

          <Stack.Item>
            <Dropdown
              label="Page 2 Property"
              selectedKey={page2Property}
              options={dropdownOptions}
              disabled
            />
          </Stack.Item>

          <Stack.Item>
            <PrimaryButton text="Submit" className={styles.button} />
          </Stack.Item>
        </Stack>
      </div>
    );
  }
}
