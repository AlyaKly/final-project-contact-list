// Variables
const URL_API_CONTACTS = 'https://api.airtable.com/v0/appnMM0MFP1gUsoem/contacts';
const HEADERS = {
    headers: {
        'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
        'Content-Type': 'application/json'
    }
};


// VUEJS

var appTableContent = new Vue({
    el: '#app-table-content',
    data: {
      contacts: [],
      searchName: '',
    },
    mounted: function() {
        this.getTableContent();
    },
    computed: {
        contactSearch: function() {
            return this.contacts.filter(function(contact){
                return contact.fields.Name.includes(appTableContent.searchName)
            });
            console.log(searchName);
        }
    },
    methods: {
        getTableContent: function() {
            // Make a request to get full list of contacts
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

