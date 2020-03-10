// JSon link and headers
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
 * @isShown - displays Add New Contact modal form on the page
 * @ContactName - Contact's Full Name
 * @contactEmail - Contact's Email Address
 * @contactPhone - Contact's Phone number
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
            // Run Post request if there are no errores
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
 * @searchName - content of the search name field
 */
var appTableContent = new Vue({
    el: '#app-table-content',
    data: {
      contacts: [],
      searchName: '',
      contactValue: '',
      modalInfo: undefined
    },
    mounted: function() {
        this.getTableContent();
    },
    computed: {
            // Function that searches by Contact Name
        contactSearch: function() {
            return this.contacts.filter(function(contact){
                return contact.fields.Name != undefined ? contact.fields.Name.includes(appTableContent.searchName.charAt(0).toUpperCase() + appTableContent.searchName.slice(1)) : []
            });
        }
    },
    methods: {
        // Function that returns a list of all existing contacts
        getTableContent: function() {
            // Get request to show full list of existing contacts
            axios.get(URL_API_CONTACTS, HEADERS)
            .then(function (response) {
                // handle success
                console.log(response.data.records);
                appTableContent.contacts = response.data.records;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        }
    }
  })


