var app = angular.module('app');

app.filter('menuFilter', function () {
    return function (input, identityCompetence, isSupperUser) {
        var result = [];
        angular.forEach(input, function (value) {
            if (identityCompetence.indexOf(value.id) != -1 || isSupperUser) {
                result.push(value);
            }
        });
        return result;
    };
});
