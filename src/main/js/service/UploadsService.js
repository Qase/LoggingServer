(function (angular) {
    angular.module("weblogger")
        .service("UploadsService", function ($http, restUrl) {
            return {
                uploadZipFile: function (file, platform, folder) {
                    return $http({
                        method: 'POST',
                        url: restUrl + '/uploads/zip/platforms/' + platform + '/folders/' + folder,
                        transformRequest: function (data) {
                            var formData = new FormData();
                            formData.append("content", file);
                            return formData;
                        },
                        headers: {'Content-Type': undefined}
                    });
                },
                getFolders: function (platform) {
                    return $http({
                        method: 'GET',
                        url: restUrl + '/uploads/platforms/' + platform + '/directories'
                    });
                },
                getDbNames: function (platform, directory) {
                    return $http({
                        method: 'GET',
                        url: restUrl + '/uploads/platforms/' + platform + '/directories/' + directory
                    });
                },
                getLogs: function (platform, directory, dbName) {
                    return $http({
                        method: 'GET',
                        url: restUrl + '/uploads/platforms/' + platform + '/directories/' + directory + '/logs',
                        params: {
                            dbName: dbName
                        }
                    });
                }
            };
        });
})(angular);