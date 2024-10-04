import * as React from "react";
import styles from "./RegistrationForm.module.scss";
import {
  TextField,
  Checkbox,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  Stack,
  DefaultButton,
  IconButton,
  ITextFieldProps,
  IColumn,
  DetailsList,
  DetailsListLayoutMode,
  SearchBox,
  Label,
  Callout,
  Overlay,
  Dialog,
  DialogType,
  DialogFooter,
} from "@fluentui/react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as _ from "lodash";

// import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IRegistrationFormProps {
  context: WebPartContext;
}

export interface IListItems {
  Title: string;
  Email: string;
  Phone: string;
  Password: string;
  Description: string;
  Roles: {
    Title: string;
  };
  ManagerName: {
    Id: string;
    title: string;
    email: string;
    jobTitle: string;
  };
}

export interface IRegistrationFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  termsChecked: boolean;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  isDialogVisible: boolean,
  showPassword: boolean;
  nameError: string | undefined;
  emailError: string | undefined;
  passwordError: string | undefined;
  phoneError: string | undefined;
  termsCheckedError: string | undefined;
  listItems: IListItems[];
  showTable: boolean;
  searchName: string;
  searchEmail: string;
  searchPhone: string;
  filteredItems: IListItems[];
  searchQuery: string;
  currentPage: number;
  itemPerPage: number;
  pageInput: string;
  noDataFound: boolean;
  isSortedDescending: boolean;
  sortedColumns: keyof IListItems | undefined;
  showCallout: boolean;
  calloutTarget: HTMLElement | undefined;
  calloutItem: IListItems | undefined;
}

export default class RegistrationForm extends React.Component<
  IRegistrationFormProps,
  IRegistrationFormState
> {
  constructor(props: IRegistrationFormProps) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      phone: "",
      termsChecked: false,
      errorMessage: undefined,
      successMessage: undefined,
      isDialogVisible: false,
      showPassword: false,
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      phoneError: undefined,
      termsCheckedError: undefined,
      listItems: [],
      showTable: false,
      searchName: "",
      searchEmail: "",
      searchPhone: "",
      filteredItems: [],
      searchQuery: "",
      currentPage: 1,
      itemPerPage: 5,
      pageInput: "1",
      noDataFound: false,
      isSortedDescending: false,
      sortedColumns: undefined,
      showCallout: false,
      calloutTarget: undefined,
      calloutItem: undefined,
    };
  }

  private handleInputChange = (
    field: keyof IRegistrationFormState,
    value: string | boolean
  ): void => {
    if (field === "name" && typeof value === "string") {
      const capitalizedValue = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      value = capitalizedValue;
    }

    this.setState(
      {
        [field]: value,
      } as unknown as Pick<
        IRegistrationFormState,
        keyof IRegistrationFormState
      >,
      () => {
        this.validateField(field, value);
      }
    );
  };

  private handleBlur = (
    field: keyof IRegistrationFormState,
    value: string | boolean
  ): void => {
    this.validateField(field, value);
  };

  private validateField = (
    field: keyof IRegistrationFormState,
    value: string | boolean
  ): void => {
    const errorMessages: string[] = [];
  
    switch (field) {
      case "name": {
        const nameValue = value as string;
  
        if (!nameValue) {
          errorMessages.push("Please enter your name.");
        } else if (!nameValue.trim()) {
          errorMessages.push("Name should not be empty or consist only of spaces.");
        } else if (nameValue.trim()[0] === " ") {
          errorMessages.push("Please enter a valid name. It should not start with a space.");
        } else if (!/^[A-Za-z\s]+$/.test(nameValue)) {
          errorMessages.push("Please enter a valid name using alphabetic characters only.");
        }
  
        this.setState({ nameError: errorMessages.length > 0 ? errorMessages.join(' ') : undefined });
        break;
      }
  
      case "email": {
        const emailValue = value as string;
  
        if (!emailValue) {
          errorMessages.push("Please enter your email.");
        } else if (!this.validateEmail(emailValue)) {
          errorMessages.push("Please enter a valid email in '@gmail.com' format.");
        }
  
        this.setState({ emailError: errorMessages.length > 0 ? errorMessages.join(' ') : undefined });
        break;
      }

      case "password": {
        const passwordErrors = this.validatePassword(value as string);
        // Join password errors into a single string
        this.setState({ passwordError: passwordErrors.length > 0 ? passwordErrors.join('\n') : undefined });
        break;
      }
  
      case "phone": {
        const phoneValue = value as string;
  
        if (!phoneValue) {
          errorMessages.push("Please enter your phone number.");
        } else if (phoneValue.length !== 10 || isNaN(Number(phoneValue))) {
          errorMessages.push("Phone number must be exactly 10 digits.");
        }
  
        this.setState({ phoneError: errorMessages.length > 0 ? errorMessages.join(' ') : undefined });
        break;
      }
  
      case "termsChecked": {
        if (!value) {
          errorMessages.push("You must accept the terms and conditions.");
        }
  
        this.setState({ termsCheckedError: errorMessages.length > 0 ? errorMessages.join(' ') : undefined });
        break;
      }
  
      default:
        break;
    }
  };
  
  

  private togglePasswordVisibility = (): void => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  private validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@gmail\.com$/;
    return re.test(String(email).trim().toLowerCase());
  };

  private validatePassword = (password: string): string[] => {
    const errors: string[] = [];
  
    if (!password) {
      errors.push("Please enter your password.");
    } else {
      if (password.length < 8 || password.length > 16) {
        errors.push("Password must be 8-16 characters long.");
      }
  
      if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
      }
  
      if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
      }
  
      if (!/\d/.test(password)) {
        errors.push("Password must contain at least one digit.");
      }
  
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Password must contain at least one special character.");
      }
    }
  
    return errors;
  };
  
  
  private closeDialog = (): void => {
    this.setState({
      isDialogVisible: false,
      name: "",
      email: "",
      password: "",
      phone: "",
      termsChecked: false,
      showPassword: false,
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      phoneError: undefined,
    })
  }

  private handleSubmit = async (): Promise<void> => {
    const {
      name,
      email,
      password,
      phone,
      termsChecked,
      nameError,
      emailError,
      passwordError,
      phoneError,
      termsCheckedError,
    } = this.state;

    // Validate each field before submitting
    this.validateField("name", name);
    this.validateField("email", email);
    this.validateField("password", password);
    this.validateField("phone", phone);
    this.validateField("termsChecked", termsChecked);

    // Check for updated error messages in the state after validation
    const updatedNameError = nameError;
    const updatedEmailError = emailError;
    const updatedPasswordError = passwordError;
    const updatedPhoneError = phoneError;
    const updatedTermsCheckedError = termsCheckedError;

    // Check if any error messages exist
    const hasErrors = [
      updatedNameError,
      updatedEmailError,
      updatedPasswordError,
      updatedPhoneError,
      updatedTermsCheckedError,
    ].some((error) => error);

    // Set the error message for terms acceptance
    if (!termsChecked) {
      this.setState({
        termsCheckedError: "You must accept the terms and conditions.",
      });
      return;
    }

    // If there are any errors, set them in state and return
    if (hasErrors) {
      this.setState({
        errorMessage: "Please fill all the fields!"
      });
      return;
    }

    try {
      const itemData = {
        Title: name,
        Email: email.toLowerCase(),
        Phone: phone,
        Password: password,
        TermsChecked: termsChecked,
      };

      await sp.web.lists
        .getByTitle("RegistrationForm")
        .items.add(itemData)
        .then((response) => {
          this.setState({
            errorMessage: undefined,
            isDialogVisible: true,
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            errorMessage: "Error creating the account. Please try again.",
          });
        });
    } catch (error) {
      console.error(error);
      this.setState({
        errorMessage: "Error creating the account. Please try again.",
      });
    }
  };

  private handleReset = (): void => {
    this.setState({
      name: "",
      email: "",
      password: "",
      phone: "",
      termsChecked: false,
      errorMessage: undefined,
      isDialogVisible: false,
      showPassword: false,
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      phoneError: undefined,
      termsCheckedError: undefined,
      listItems: [],
      showTable: false,
      searchName: "",
      searchEmail: "",
      searchPhone: "",
      filteredItems: [],
      searchQuery: "",
      currentPage: 1,
      itemPerPage: 5,
      pageInput: "1",
      noDataFound: false,
      isSortedDescending: false,
      sortedColumns: undefined,
    });
  };

  private fetchData = async (): Promise<void> => {
    try {
      const registrationItems = await sp.web.lists
        .getByTitle("RegistrationForm")
        .items.select(
          "Title",
          "Email",
          "Phone",
          "Roles/Title",
          "Description",
          "ManagerNameId"
        )
        .expand("Roles")
        .get(); //ManagerNameId (lookup ID)

      // Manager (Person column)
      const departmentItems = await sp.web.lists
        .getByTitle("RegistrationDepartment")
        .items.select(
          "Id",
          "Manager/Title",
          "Manager/EMail",
          "Manager/JobTitle"
        )
        .expand("Manager")
        .get();

      // Map department items by their IDs for quick access to Manager data
      const managerMap = departmentItems.reduce((map, item) => {
        map[item.Id] = {
          title: item.Manager?.Title || "No Manager",
          email: item.Manager?.EMail || "",
          jobTitle: item.Manager?.JobTitle || "",
        };
        return map;
      }, {});

      // Enrich registration items with manager details using the lookup ID (ManagerNameId)
      const enrichedItems = registrationItems.map((item) => ({
        ...item,
        ManagerName: {
          ...item.ManagerName,
          title: managerMap[item.ManagerNameId]?.title || "No Manager",
          email: managerMap[item.ManagerNameId]?.email || "",
          jobTitle: managerMap[item.ManagerNameId]?.jobTitle || "",
        },
      }));

      // Update state with enriched items
      this.setState({
        listItems: enrichedItems,
        showTable: enrichedItems.length > 0,
        filteredItems: enrichedItems,
        noDataFound: enrichedItems.length === 0,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        errorMessage: "Error fetching the data. Please try again later.",
        showTable: false,
      });
    }
  };

  private hideData = (): void => {
    this.setState({ showTable: false });
  };

  private handleSearch = (): void => {
    const { listItems, searchQuery } = this.state;

    const filteredItems = listItems.filter((item) => {
      const itemName = item.Title ? item.Title.toLowerCase() : "";
      const itemEmail = item.Email ? item.Email.toLowerCase() : "";
      const itemPhone = item.Phone ? item.Phone.toString() : "";

      const itemRole =
        item.Roles && item.Roles.Title
          ? item.Roles.Title.toLowerCase()
          : "No Role";
      const itemManager =
        item.ManagerName && item.ManagerName.title
          ? item.ManagerName.title.toLowerCase()
          : "No Manager";

      return (
        itemName.includes(searchQuery.toLowerCase()) ||
        itemEmail.includes(searchQuery.toLowerCase()) ||
        itemPhone.includes(searchQuery) ||
        itemRole.includes(searchQuery.toLowerCase()) ||
        itemManager.includes(searchQuery.toLowerCase())
      );
    });

    this.setState({
      filteredItems,
      noDataFound: filteredItems.length === 0,
      currentPage: 1,
    });
  };

  private handleSort = (column: keyof IListItems): void => {
    const { filteredItems, isSortedDescending, sortedColumns } = this.state;

    // Define the sorting function based on the column type
    const getSortValue = (item: IListItems): string => {
      switch (column) {
        case "Roles":
          return item.Roles?.Title || "No Role";
        case "ManagerName":
          return item.ManagerName.title || "No Manager";
        default:
          return item[column];
      }
    };

    const sortedItems = _.orderBy(
      filteredItems,
      [getSortValue],
      [isSortedDescending ? "asc" : "desc"]
    );

    this.setState({
      filteredItems: sortedItems,
      isSortedDescending:
        sortedColumns === column ? !isSortedDescending : false,
      sortedColumns: column,
    });
  };

  private handlePaginationChange = (page: number): void => {
    this.setState({ currentPage: page });
  };

  private handlePageInputChange = (
    event: React.FormEvent<HTMLInputElement>,
    newValue?: string
  ): void => {
    const { filteredItems, itemPerPage } = this.state;
    const totalPages = Math.ceil(filteredItems.length / itemPerPage);

    // Set the pageInput to newValue and check if newValue is empty
    this.setState({ pageInput: newValue || "" }, () => {
      // If newValue is empty, reset to the first page
      if (!newValue) {
        this.setState({ currentPage: 1 });
        return;
      }

      // If newValue is provided, check if it's a valid number
      const pageNumber = parseInt(newValue, 10);

      // Update currentPage only if the number is valid and within range
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        this.setState({ currentPage: pageNumber });
      } else {
        alert(
          "Invalid page number! Please enter a number between 1 and " +
            totalPages
        );
        this.setState({ pageInput: "1", currentPage: 1 }); // Reset to first page if invalid
      }
    });
  };

  handleItemClick = (
    item: IListItems,
    event: React.MouseEvent<HTMLElement>
  ): void => {
    this.setState({
      showCallout: true,
      calloutTarget: event.currentTarget,
      calloutItem: item,
    });

    document
      .querySelector(".detailsListContainer")
      ?.classList.add("blurBackground");
  };

  hideCallout = (): void => {
    this.setState({
      showCallout: false,
      calloutTarget: undefined,
      calloutItem: undefined,
    });

    document
      .querySelector(".detailsListContainer")
      ?.classList.remove("blurBackground");
  };

  public render(): React.ReactElement<IRegistrationFormProps> {
    const {
      name,
      email,
      password,
      phone,
      termsChecked,
      errorMessage,
      isDialogVisible,
      showPassword,
      nameError,
      emailError,
      passwordError,
      phoneError,
      showTable,
      filteredItems,
      searchQuery,
      currentPage,
      itemPerPage,
      pageInput,
      noDataFound,
      isSortedDescending,
      sortedColumns,
      showCallout,
      calloutTarget,
      calloutItem,
    } = this.state;

    const getColumnIcon = (column: keyof IListItems): string => {
      if (sortedColumns === column) {
        return isSortedDescending ? " ⇩" : " ⇧";
      }
      return "";
    };

    const columns: IColumn[] = [
      {
        key: "column1",
        name: `Name${getColumnIcon("Title")}`,
        fieldName: "Title",
        minWidth: 100,
        maxWidth: 100,

        onRender: (item) => (
          <span
            style={{
              cursor: "pointer",
              color: "#0078d4",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
            title="Click to display information..."
            onClick={(event) => this.handleItemClick(item, event)}
          >
            {item.Title}
          </span>
        ),
        onColumnClick: () => this.handleSort("Title"),
      },
      {
        key: "column2",
        name: `Email${getColumnIcon("Email")}`,
        fieldName: "Email",
        minWidth: 100,
        maxWidth: 100,
        styles: {
          root: {
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        },
        onColumnClick: () => this.handleSort("Email"),
      },
      {
        key: "column3",
        name: `Phone${getColumnIcon("Phone")}`,
        fieldName: "Phone",
        minWidth: 100,
        maxWidth: 100,
        styles: {
          root: {
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        },
        onColumnClick: () => this.handleSort("Phone"),
      },
      {
        key: "column4",
        name: `Roles${getColumnIcon("Roles")}`,
        fieldName: "Roles",
        minWidth: 100,
        maxWidth: 100,
        styles: {
          root: {
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        },
        onRender: (item) => <span>{item.Roles?.Title || "No Role"}</span>,
        onColumnClick: () => this.handleSort("Roles"),
      },
      {
        key: "column5",
        name: `ManagerName${getColumnIcon("ManagerName")}`,
        fieldName: "ManagerName",
        minWidth: 100,
        maxWidth: 100,
        styles: {
          root: {
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        },
        onRender: (item) => (
          <span>{item.ManagerName?.title || "No Manager"}</span>
        ),
        onColumnClick: () => this.handleSort("ManagerName"),
      },
    ];

    const startIndex = (currentPage - 1) * itemPerPage;
    const paginatedItems = filteredItems.slice(
      startIndex,
      startIndex + itemPerPage
    );

    const totalPages = Math.ceil(filteredItems.length / itemPerPage);

    return (
      <div className={styles.registrationContainer}>
        <h2>Create Your Account</h2>

        {errorMessage && (
          <MessageBar messageBarType={MessageBarType.error}>
            {errorMessage}
          </MessageBar>
        )}

        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Name"
            required
            value={name}
            onChange={(_, newValue) =>
              this.handleInputChange("name", newValue || "")
            }
            onBlur={(event) =>
              this.handleBlur("name", (event.target as HTMLInputElement).value)
            }
            errorMessage={nameError}
          />
          <TextField
            label="Email"
            required
            value={email.trim()}
            onChange={(_, newValue) =>
              this.handleInputChange("email", newValue || "")
            }
            onBlur={(event) =>
              this.handleBlur("email", (event.target as HTMLInputElement).value)
            }
            errorMessage={emailError}
          />

          <TextField
            label="Password"
            required
            type={showPassword ? "text" : "password"}
            value={password.trim()}
            onChange={(_, newValue) =>
              this.handleInputChange("password", newValue || "")
            }
            onBlur={(event) =>
              this.handleBlur(
                "password",
                (event.target as HTMLInputElement).value
              )
            }
            onRenderSuffix={(props: ITextFieldProps) => (
              <IconButton
                iconProps={{ iconName: showPassword ? "Hide" : "RedEye" }}
                onClick={this.togglePasswordVisibility}
                ariaLabel={showPassword ? "Hide password" : "Show password"}
              />
            )}
            errorMessage={passwordError}
          />

          <TextField
            label="Phone Number"
            required
            value={phone.trim()}
            onChange={(_, newValue) => {
              if (/^\d*$/.test(newValue || "")) {
                this.handleInputChange("phone", newValue || "");
              }
            }}
            onBlur={(event) =>
              this.handleBlur("phone", (event.target as HTMLInputElement).value)
            }
            errorMessage={phoneError}
          />
          <Checkbox
            onRenderLabel={() => (
              <>
                I agree to the terms and conditions
                {this.state.termsCheckedError && (
                  <span style={{ color: "#990F02", marginLeft: 5, fontSize: "small" }}>
                    {this.state.termsCheckedError}
                  </span>
                )}
              </>
            )}
            checked={termsChecked}
            required
            onChange={(_, checked) => {
              this.handleInputChange("termsChecked", checked || false);
              this.validateField("termsChecked", checked || false);
            }}
          />

          <Stack
            horizontal
            wrap
            tokens={{ childrenGap: 10 }}
            horizontalAlign="center"
          >
            <PrimaryButton text="Submit" onClick={this.handleSubmit} />

            <Dialog
              hidden={!isDialogVisible} // Show dialog based on isDialogVisible state
              onDismiss={this.closeDialog}
              dialogContentProps={{
                type: DialogType.normal,
                title: "Account Created",
              }}
            >
              <div style={{ color: 'green', padding: '0 24px 24px' }}>
                {this.state.name}, your account has been created successfully!
              </div>
              <DialogFooter>
                <PrimaryButton onClick={this.closeDialog} text="OK" />
              </DialogFooter>
            </Dialog>

            <DefaultButton text="Reset" onClick={this.handleReset} />
            {!showTable ? (
              <PrimaryButton text="Fetch Data" onClick={this.fetchData} />
            ) : (
              <DefaultButton text="Hide Data" onClick={this.hideData} />
            )}
          </Stack>

          {showTable && (
            <div>
              <SearchBox
                className={styles.smallRoundedSearchBox}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e, value) =>
                  this.setState({ searchQuery: value || "" }, this.handleSearch)
                }
              />
              <DetailsList
                items={paginatedItems}
                columns={columns}
                layoutMode={DetailsListLayoutMode.fixedColumns}
                isHeaderVisible={true}
              />
              {noDataFound && (
                <MessageBar messageBarType={MessageBarType.warning}>
                  No data found.
                </MessageBar>
              )}

              {/* Pagination Stack */}
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between"
                tokens={{ childrenGap: 15 }}
                styles={{
                  root: { marginTop: 20, width: "100%", flexWrap: "nowrap" }, // Disable wrapping
                }}
              >
                <Stack
                  horizontal
                  verticalAlign="center"
                  styles={{ root: { flexGrow: 1, flexBasis: "100px" } }} // Allow this stack to grow but have a minimum space
                >
                  <TextField
                    value={pageInput}
                    onChange={this.handlePageInputChange}
                    styles={{ root: { minWidth: 30, maxWidth: 50 } }} // Ensure it stays within screen limits
                    placeholder="Go"
                  />
                </Stack>

                <Stack
                  horizontal
                  verticalAlign="center"
                  tokens={{ childrenGap: 10 }}
                  styles={{
                    root: {
                      flexGrow: 0,
                      flexShrink: 1,
                      textAlign: "right",
                      whiteSpace: "wrap", // Prevent wrapping of the pagination controls
                    },
                  }}
                >
                  <IconButton
                    iconProps={{ iconName: "ChevronLeft" }}
                    onClick={() => this.handlePaginationChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous Page"
                    ariaLabel="Previous Page"
                  />
                  <Label styles={{ root: { whiteSpace: "nowrap" } }}>
                    Page {currentPage} of {totalPages}
                  </Label>
                  <IconButton
                    iconProps={{ iconName: "ChevronRight" }}
                    onClick={() => this.handlePaginationChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                    ariaLabel="Next Page"
                  />
                </Stack>
              </Stack>
            </div>
          )}

          {showCallout && calloutItem && (
            <>
              {/* Overlay for blur effect */}
              <Overlay
                styles={{
                  root: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
                }}
                onClick={this.hideCallout} // Dismiss the callout when clicking on overlay
              />

              {/* Callout with responsive max width */}
              <Callout
                target={calloutTarget}
                onDismiss={this.hideCallout}
                setInitialFocus
                styles={{ root: { maxWidth: "95vw", width: 400 } }} // Max width set to 95% of the viewport
              >
                <div style={{ padding: 20 }}>
                  <Label>Title:</Label>
                  <div>{calloutItem.Title}</div>
                  <Label>Email:</Label>
                  <div>{calloutItem.Email}</div>
                  <Label>Phone Number:</Label>
                  <div>{calloutItem.Phone}</div>
                  <Label>Role:</Label>
                  <div>{calloutItem.Roles?.Title || "No Role"}</div>
                  <Label>Description:</Label>
                  <div>
                    {calloutItem.Description
                      ? calloutItem.Description
                      : "No Description"}
                  </div>
                  <Label style={{ color: "#000", fontWeight: "bold" }}>
                    Manager Data:
                  </Label>
                  <div>
                    &#91;
                    <div style={{ paddingLeft: "10px" }}>
                      <div>
                        <strong>Name:</strong>{" "}
                        {calloutItem.ManagerName?.title || "No Name"}
                      </div>
                      <div>
                        <strong>Job Title:</strong>{" "}
                        {calloutItem.ManagerName?.jobTitle || "No Job Title"}
                      </div>
                      <div>
                        <strong>Email:</strong>{" "}
                        {calloutItem.ManagerName?.email || "No Email"}
                      </div>
                    </div>
                    &#93;
                  </div>
                </div>
              </Callout>
            </>
          )}
        </Stack>
      </div>
    );
  }
}
