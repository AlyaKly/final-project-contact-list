// Variables
const URL_API_CONTACTS = 'https://api.airtable.com/v0/appnMM0MFP1gUsoem/contacts';
const HEADERS = {
    headers: {
        'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
        'Content-Type': 'application/json'
    }
};


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
                return contact.fields.Name.includes(appTableContent.searchName.charAt(0).toUpperCase() + appTableContent.searchName.slice(1))
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


