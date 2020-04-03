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
        // Function that validates empty fields and return errores
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
 * Sorting by columns
 * @sortByColumn - defines which column title has been clicked to sort the table by this column
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
 * @pagesArray - list of the pages' numbers displayed
 * @NUM_PAGES - maximum number of pages that should be displayed 
 * @totalPages - total number of pages
 * @LAST_PAGE - number of the last page
 */
var appTableContent = new Vue({
    el: '#app-table-content',
    data: {
      contacts: [],
      searchName: '',
      sortByColumn: '',
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
      NUM_PAGES: 3,
      pagesNum: ''
    },
    mounted: function() {
        // Display table with existing contacts on page loading
        this.getTableContent();
        // this.getCurrentPage();
    },
    computed: {
        // Function that sorts the table by columns
        sortByColumns: function() {
            return this.contacts.map(function (contact) {
                let tempContact = contact;
                tempContact.createdTime = new Date(contact.createdTime).getTime()
                return tempContact
            }).sort(function(a, b) {
                // Sort the table by Full Name column
                if(appTableContent.sortByColumn === 'fullName'){
                    return (a.fields.Name.toLowerCase() < b.fields.Name.toLowerCase()) > 0 ? 1 : -1;
                } 
                // Sort the table by Email Address
                else if(appTableContent.sortByColumn === 'emailAddress'){
                    return (a.fields.Email.toLowerCase() < b.fields.Email.toLowerCase()) > 0 ? 1 : -1;
                } 
                // Sort the table by Phone Number
                else if(appTableContent.sortByColumn === 'phoneNumber'){
                    return (a.fields.Phone.toLowerCase() < b.fields.Phone.toLowerCase()) > 0 ? 1 : -1;
                } 
                // Sort the table by default by Created date
                else {
                    return a.createdTime - b.createdTime
                }
            }).reverse()
        },
        // Function that searches by Contact Name
        contactSearch: function() {
            return this.sortByColumns.filter(function(contact){
                return contact.fields.Name != undefined ? contact.fields.Name.includes(appTableContent.searchName.charAt(0).toUpperCase() + appTableContent.searchName.slice(1)) : []
            });
        },
        // Function that gets exact number of Contacts for each page
        contactPerPage: function() {
            return this.contactSearch.slice((this.page - 1) * this.perPage, (this.page - 1) * this.perPage + this.perPage)
        },
        // lastPage: function() {
        //     const ULTIMA_PAG = Math.ceil(this.contactSearch.length / this.perPage)
        //         console.log(ULTIMA_PAG)
        //         console.log('test')

        //         return this.page === ULTIMA_PAG;
        // } 
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
        },
    },
    methods: {
        // Function that returns a list of all existing contacts
        getTableContent: function() {
            // Get request to show full list of existing contacts
            axios.get(URL_API_CONTACTS, HEADERS)
            .then(function (response) {
                // handle success
                // console.log(response.data.records)
                appTableContent.contacts = response.data.records;
                appTableContent.pagesNum = appTableContent.contacts.length;
                // appTableContent.pagesNum = Math.ceil(appTableContent.contacts.length / appTableContent.perPage);
                appTableContent.getCurrentPage();

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        },
        // Function that validates empty fields and returns errores
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
        // Function that clears the Searc field
        clearSearchField: function() {
            this.searchName = '';
        },
        // Function that navigates to the previous page if the button is available
        goToPreviousPage: function() {
            if(this.page != 1) {
                 this.page -= 1
                //  console.log(this.page)
            }
            appTableContent.getCurrentPage();
        },
        // Function that navigates to the next page if the button is available
        goToNextPage: function() {
            if(this.contactPerPage.length == this.perPage) {
                this.page += 1
                // console.log(this.page)
            }
            appTableContent.getCurrentPage();
        },
        // Function that shows maximum 3 page buttons
        getCurrentPage: function() {
            this.totalPages = Math.ceil(this.pagesNum / this.perPage);
            // console.log('total num of pages = ' + this.totalPages);
            // console.log('max pages = ' + this.NUM_PAGES);

            const LAST_PAGE = Math.ceil(this.contactSearch.length / this.perPage)
            
            // console.log('last ' + LAST_PAGE)

            // console.log(this.page)
            // If there are more than 3 (NUM_PAGES) pages than show 3 buttons with page numbers
            if(this.totalPages >= this.NUM_PAGES) {
                // IF current page is the first one
                if(this.page == 1) {
                    this.pagesArray = [this.page];
                    this.pagesArray.push(this.page + 1);
                    this.pagesArray.push(this.page + 2);
                } 
                // if current page is the last one
                else if(this.page == LAST_PAGE) {
                    // console.log(this.page)
                    this.pagesArray = [this.page];
                    this.pagesArray.unshift(this.page - 1);
                    this.pagesArray.unshift(this.page - 2);
                } 
                // If current page is between the firts and the last pages
                else {
                this.pagesArray = [this.page];
                this.pagesArray.unshift(this.page - 1);
                this.pagesArray.push(this.page + 1);
                }
            // console.log('3 my pages = ' + this.pagesArray)
            }
            // If there are less than 3 (NUM_PAGES) pages than show only 2 buttons with page numbers
            else if(this.totalPages == 2) {
                if(this.page == 1) {
                    this.pagesArray = [this.page];
                    this.pagesArray.push(this.page + 1);
                } else {
                    // console.log(this.page)
                    this.pagesArray = [this.page];
                    this.pagesArray.unshift(this.page - 1);
                }
            // console.log('2 my pages = ' + this.pagesArray)
            }

            // If there is onle 1 page
            else {
                this.pagesArray = [this.page];
                    // console.log('1 my pages = ' + this.pagesArray)

            }
        },
        // Function that gets curent page from the HTML
        showPagesNumbers: function(tmp) {
            this.page = tmp;
            this.getCurrentPage();
        }
    }
  })


