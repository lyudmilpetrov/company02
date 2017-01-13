oM.service('ID', function () {
    var property = {};
    property.N = 'Future User';
    property.R = 'None';
    return {
        getProperty: function () {
            return property;
        },
        setPropertyN: function (value) {
            property.N = value;
        },
        setPropertyR: function (value) {
            property.R = value;
        }
    };
});