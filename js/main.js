// JSon link to the Airtable with headers
const URL_API_CONTACTS = 'https://api.airtable.com/v0/appnMM0MFP1gUsoem/contacts';
const HEADERS = {
    headers: {
        'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
        'Content-Type': 'application/json'
    }
};

// VUE 

/**
 * Add New Contact form
 * @isShowModal - displays Add New Contact modal form on the page
 * @ContactName - Contact Full Name
 * @contactEmail - Contact Email Address
 * @contactPhone - Contact Phone number
 * @nameError - is True if the Contact Full Name is empty
 * @emailError - is True if the Contact's Email Address is empty
 * @phoneError - is True if the Contact's Phone Number is empty
 */
var app = new Vue({
    el: '#vueapp',
    data: {
      isShowModal: false,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      nameError: false,
      emailError: false,
      phoneError: false,
    },
    watch: {
        // Clears all fields errores when the Create Contact Modal form is closed by Cancel button
        isShowModal: function() {
            this.nameError = false;
            this.emailError = false;
            this.phoneError = false;
        }
    },
    methods: {
        fieldsValidation: function () {
            // validattion for empty "Full Name" field 
            this.nameError = false;
            if (this.contactName === '') {
                this.nameError = true;
            }
            // validattion for empty "Email Address" field 
            this.emailError = false;
            if (this.contactEmail === '') {
                this.emailError = true;
            }
            // validattion for empty "Phone Number" field 
            this.phoneError = false;
            if (this.contactPhone === '') {
                this.phoneError = true;
            }
        },
        createNewContact: function() {
            // Run fields validation function
            this.fieldsValidation();
            // Run POST request if there are no errores
            if(!this.nameError && !this.emailError && !this.phoneError){
                axios.post(URL_API_CONTACTS, {
                    fields: {
                        Name: app.contactName,
                        Email: app.contactEmail,
                        Phone: app.contactPhone
                    }
                }, HEADERS)
                  .then(function (response) {
                    console.log(response);
                    // Close the Create Contact modal form
                    app.isShowModal = false;
                    // Refresh the list of Contacts
                    appTableContent.getTableContent();
                    // Empty fields on the Create Contact modal form
                    app.emptyCreateForm();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        },
        // Function that cleans all fields on the Create Contact modal form
        emptyCreateForm: function() {
            app.contactName = '';
            app.contactEmail = '';
            app.contactPhone = '';
        }
    }
  });


/**
 * View list of existing contacts
 * @contacts - array with a list of all existing contacts
 * Search field
 * @searchName - content of the search name field
 * View Contact Form
 * @modalInfo - if True shows the View Contact modal form
 * Remove Contact Form
 * @deleteRecord - if True shows the Delete Contact modal form
 * Edit Contact Form
 * @modalEdit - if True shows Edit Contact modal form
 * @editName - contact Name for Watching
 * @editEmail - contact Email for Watching
 * @editPhone - contact Phone number for Watching
 * @editContactID - Contact ID required for Contact Update
 * @editNameError - is True if new Contact Name is empty
 * @editEmailError - is True if new Contact Email is empty
 * @editPhoneError - is True if new Contact Phone number is empty
 * Pagination
 * @page - current page
 * @perPage - number of Contacts displayed on each page
 * @pagesArray - list of page numbers displayed
 * @NUM_PAGES - maximum number of pages that should be displayed 
 */
var appTableContent = new Vue({
    el: '#app-table-content',
    data: {
      contacts: [],
      searchName: '',
      contactValue: '',
      modalInfo: undefined,
      deleteRecord: undefined,
      modalEdit: undefined,
      editName: undefined,
      editEmail: undefined,
      editPhone: undefined,
      editContactID: undefined,
      editNameError: false,
      editEmailError: false,
      editPhoneError: false,
      page: 1,
      perPage: 5,
      pagesArray: [],
      NUM_PAGES: 3
    },
    mounted: function() {
        // Display table with existing contacts on page loading
        this.getTableContent();
        this.getCurrentPage();
    },
    computed: {
        // Function that searches by Contact Name
        contactSearch: function() {
            return this.contacts.filter(function(contact){
                return contact.fields.Name != undefined ? contact.fields.Name.includes(appTableContent.searchName.charAt(0).toUpperCase() + appTableContent.searchName.slice(1)) : []
            });
        },
        // Function that gets total number of pages for the table
        getPages: function() {
            console.log(this.contactSearch.length)
            return Math.ceil(this.contactSearch.length / this.perPage);
        },
        // Function that gets exact number of Contacts for each page
        contactPerPage: function() {
            return this.contactSearch.slice((this.page - 1) * this.perPage, (this.page - 1) * this.perPage + this.perPage)
        } 
    },
    watch: {
        modalEdit: function(newInfo) {
            // Clear all errores on the Edit Contact Modal form
            this.editNameError = false;
            this.editEmailError = false;
            this.editPhoneError = false;
            // Get new entered data from the Edit Contact form required for following PATCH Request
            if (newInfo != undefined) {
                this.editName = newInfo.fields.Name;
                this.editEmail = newInfo.fields.Email;
                this.editPhone = newInfo.fields.Phone;
                this.editContactID = newInfo.id;
            }
        }
    },
    methods: {
        // Function that returns a list of all existing contacts
        getTableContent: function() {
            // Get request to show full list of existing contacts
            axios.get(URL_API_CONTACTS, HEADERS)
            .then(function (response) {
                // handle success
                console.log(response.data.records)
                appTableContent.contacts = response.data.records;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        },
        editFieldsValidation: function () {
            // validattion for empty "Full Name" field 
            this.editNameError = false;
            if (this.editName === '') {
                this.editNameError = true;
            }
            // validattion for empty "Email Address" field 
            this.editEmailError = false;
            if (this.editEmail === '') {
                this.editEmailError = true;
            }
            // validattion for empty "Phone Number" field 
            this.editPhoneError = false;
            if (this.editPhone === '') {
                this.editPhoneError = true;
            }
        },
        // Function that updates an existing contact
        updateContact: function() {
            // Run fields validation function
            this.editFieldsValidation();
            // Run Patch request if there are no errores
            if(!this.editNameError && !this.editEmailError && !this.editPhoneError){
                // PATCH Request to udplate selected contact
                axios.patch(URL_API_CONTACTS, {
                    "records": [
                        {
                            "id": this.editContactID,
                            "fields": {
                                "Name": this.editName,
                                "Email": this.editEmail,
                                "Phone": this.editPhone
                            }
                        }
                    ]
                }, HEADERS)
                .then((response) => {
                    console.log(response);
                });
                // Close the Edit Contact modal form
                appTableContent.modalEdit = undefined;
                // Refresh the contacts list with new updated contact
                this.getTableContent();
            }
        },
        // Function that removes selected contact from the list
        removeContact: function() {
            // Contact ID value
            let recordID = this.deleteRecord.id;
            // Delete Request to remove the contact by contact ID
            axios.delete(URL_API_CONTACTS, {
                headers: {
                    'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
                    'Content-Type': 'application/json'
                },
                params: {
                        records: [recordID]
                        }
                });
                // Close the modal form
                appTableContent.deleteRecord = undefined;
                // Refresh the table with contacts
                this.getTableContent();

        },
        // Function that navigates to the previous page if the button is available
        goToPreviousPage: function() {
            if(this.page != 1) {
                return this.page -= 1
            }
        },
        // Function that navigates to the next page if the button is available
        goToNextPage: function() {
            if(this.contactPerPage.length == this.perPage) {
                return this.page += 1
            }
        },
        // Function that shows maximum 3 page buttons
        getCurrentPage: function() {
            // Show only one button with number "1" if there is one page
            console.log(this.getPages)
            if(this.getPages <= 1) {
                this.pagesArray = [this.page];
            } 
            // Show only two buttons with numbers if there are two pages
            else if(1 < this.getPages < this.NUM_PAGES) {
                this.pagesArray = [this.page];
                this.pagesArray = this.pagesArray.push(this.page + 1);
            } 
            // Show only 3 buttons with numbers if there are 3 or more pages
            else {
                this.pagesArray = [this.page];
                this.pagesArray = this.pagesArray.unshift(this.page - 1).push(this.page + 1);
            }
            console.log('my pages = ' + this.pagesArray)
        }
    }
  })


