// Variables
const URL_API_CONTACTS = 'https://api.airtable.com/v0/appnMM0MFP1gUsoem/contacts';
const HEADERS = {
    headers: {
        'Authorization': 'Bearer keyY3rOI3oiWEV6uf',
        'Content-Type': 'application/json'
    }
};


// VUEJS

var app = new Vue({
    el: '#app-table-content',
    data: {
      contacts: []
    },
    mounted: function() {
        this.getTableContent();
    },
    methods: {
        getTableContent: function() {
            // Make a request for a user with a given ID
            axios.get(URL_API_CONTACTS, HEADERS)
            .then(function (response) {
                // handle success
                console.log(response);
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
