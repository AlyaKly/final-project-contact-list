// Variables
const URL_API_CONTACTS = 'https://api.airtable.com/v0/appnMM0MFP1gUsoem/contacts';
const HEADERS = {
    headers: {
        'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
        'Content-Type': 'application/json'
    }
};


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
    // mounted: function() {
    //     this.createNewContact()
    // },
    methods: {
        fieldsValidation: function () {
            // no son vacios
            this.nameError = false;
            if (this.contactName === '') {
                this.nameError = true;
            }
            this.emailError = false;
            if (this.contactEmail === '') {
                this.emailError = true;
            }
            this.phoneError = false;
            if (this.contactPhone === '') {
                this.phoneError = true;
            }
        },
        createNewContact: function() {
            this.fieldsValidation();
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
                    app.isShowModal = false;
                    appTableContent.getTableContent();
                    app.emptyCreateForm();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }

        },
        emptyCreateForm: function() {
            app.contactName = '';
            app.contactEmail = '';
            app.contactPhone = '';
        }
    }
  });


// View list of existing contacts
var appTableContent = new Vue({
    el: '#app-table-content',
    data: {
      contacts: [],
      searchName: ''

    },
    mounted: function() {
        this.getTableContent();
    },
    // Search by Contact Name
    computed: {
        contactSearch: function() {
            return this.contacts.filter(function(contact){
                return contact.fields.Name != undefined ? contact.fields.Name.includes(appTableContent.searchName.charAt(0).toUpperCase() + appTableContent.searchName.slice(1)) : []
            });
        }
    },
    methods: {
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


